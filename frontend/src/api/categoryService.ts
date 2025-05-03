import axiosClient from "@api/axiosClient";
import { Category } from "@/types/category";

const API_BASE_ROUTE = "/api/v1/categories";
export const categoryService = {
    getCategories: () => axiosClient.get<Category[]>(`${API_BASE_ROUTE}`),
};
