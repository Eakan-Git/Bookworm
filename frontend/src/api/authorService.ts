import axiosClient from "@api/axiosClient";
import { Author } from "@/types/author";

const API_BASE_ROUTE = "/api/v1/authors";
export const authorService = {
    getAuthors: () => axiosClient.get<Author[]>(`${API_BASE_ROUTE}`),
};
