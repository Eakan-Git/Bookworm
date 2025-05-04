import axiosClient from "@api/axiosClient";
import { LoginRequest } from "@/types/auth";
import axios from "axios";

const API_BASE_ROUTE = "/api/v1/auth";
export const authService = {
    login: (data: LoginRequest) => {
        const formData = new URLSearchParams();
        formData.append("username", data.username);
        formData.append("password", data.password);

        return axiosClient.post(`${API_BASE_ROUTE}/login`, formData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
    },
    refresh: () => {
        return axios.post(
            `${import.meta.env.VITE_API_URL}${API_BASE_ROUTE}/refresh`,
            {},
            {
                withCredentials: true,
            }
        );
    },
    logout: () => {
        return axiosClient.post(
            `${API_BASE_ROUTE}/logout`,
            {},
            {
                withCredentials: true,
            }
        );
    },
};
