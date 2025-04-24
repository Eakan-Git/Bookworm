import axiosClient from "@api/axiosClient";
import { Book } from "@/types/book";

const API_BASE_ROUTE = "/api/v1/books";
export const bookService = {
    getOnSale: () => axiosClient.get<Book[]>(`${API_BASE_ROUTE}/on-sale`),
    getPopular: () => axiosClient.get<Book[]>(`${API_BASE_ROUTE}/on-sale`),
    getById: (id: number) => axiosClient.get<Book>(`${API_BASE_ROUTE}/${id}`),
};
