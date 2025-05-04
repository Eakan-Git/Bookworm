import { create } from "zustand";
import { authService } from "@/api/authService";
import { jwtDecode } from "jwt-decode";

interface AccessTokenPayload {
  sub: string;
  user_id: number;
  first_name: string;
  last_name: string;
  admin: boolean;
  exp: number;
}

interface AuthState {
  accessToken: string | null;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    isAdmin: boolean;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setAccessToken: (token: string | null) => {
    if (!token) {
      set({ accessToken: null, user: null, isAuthenticated: false });
      return;
    }

    try {
      const decoded = jwtDecode<AccessTokenPayload>(token);

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        set({ accessToken: null, user: null, isAuthenticated: false });
        return;
      }

      set({
        accessToken: token,
        user: {
          id: decoded.user_id,
          email: decoded.sub,
          firstName: decoded.first_name,
          lastName: decoded.last_name,
          fullName: `${decoded.first_name} ${decoded.last_name}`,
          isAdmin: decoded.admin,
        },
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Failed to decode token:", error);
      set({ accessToken: null, user: null, isAuthenticated: false });
    }
  },

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ username, password });
      const { access_token } = response.data;

      // Set the access token which will also set user info
      get().setAccessToken(access_token);

      set({ isLoading: false });
      return true;
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle different types of errors
      let errorMessage = "Login failed. Please check your credentials.";

      if (error.response) {
        // The server responded with an error status
        if (error.response.status === 401) {
          errorMessage = error.response.data?.detail || "Incorrect email or password";
        } else if (error.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = error.response.data?.detail || errorMessage;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your internet connection.";
      }

      set({
        isLoading: false,
        error: errorMessage
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      get().clearAuth();
      set({ isLoading: false });
    }
  },

  clearAuth: () => {
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },
}));
