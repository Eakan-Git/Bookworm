import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/api/authService";
import { showLoginModal } from "@/utils/authUtils";

// Create axios instance
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 5000,
});

// Flag to track if a token refresh is in progress
let isRefreshing = false;

// Queue of failed requests to retry after token refresh
let failedQueue: {
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
    config: InternalAxiosRequestConfig;
}[] = [];

// Process the queue of failed requests
const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((request) => {
        if (error) {
            request.reject(error);
        } else {
            // Add the new token to the original request
            if (token) {
                request.config.headers.Authorization = `Bearer ${token}`;
            }
            request.resolve(axiosClient(request.config));
        }
    });

    // Reset the queue
    failedQueue = [];
};

// Request interceptor
axiosClient.interceptors.request.use(
    (config) => {
        const accessToken = useAuthStore.getState().accessToken;

        // If we have a token, add it to the request
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig;

        // Get the URL from the original request
        const requestUrl = originalRequest.url || '';

        // Skip token refresh for login endpoint or if not 401 or already retried
        if (
            !error.response ||
            error.response.status !== 401 ||
            (originalRequest as any)._retry ||
            requestUrl.includes('/auth/login')
        ) {
            return Promise.reject(error);
        }

        // Mark this request as retried to avoid infinite loops
        (originalRequest as any)._retry = true;

        // If a refresh is already in progress, queue this request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject, config: originalRequest });
            });
        }

        isRefreshing = true;

        try {
            // Attempt to refresh the token using our authService
            // This ensures we use the same configuration (withCredentials, etc.)
            const response = await authService.refresh();
            const { access_token } = response.data;

            // Update the token in the store
            useAuthStore.getState().setAccessToken(access_token);

            // Update the Authorization header for the original request
            originalRequest.headers.Authorization = `Bearer ${access_token}`;

            // Process any queued requests with the new token
            processQueue(null, access_token);

            // Retry the original request with the new token
            return axiosClient(originalRequest);
        } catch (refreshError) {
            // If refresh fails, clear auth state and reject all queued requests
            useAuthStore.getState().clearAuth();
            processQueue(refreshError as AxiosError);

            // If we get a 401 or 403 during refresh, the user needs to login again
            if (
                (refreshError as AxiosError)?.response?.status === 401 ||
                (refreshError as AxiosError)?.response?.status === 403
            ) {
                // Show login modal with session expired message
                console.log("Session expired. Please login again.");
                showLoginModal();

                // Call the global function if it exists
                if (window.showSessionExpiredMessage) {
                    window.showSessionExpiredMessage();
                }
            }

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default axiosClient;
