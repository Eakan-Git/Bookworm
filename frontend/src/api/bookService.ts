import axiosClient from "@api/axiosClient";
import { Book } from "@/types/book";
import { PaginatedResponse } from "@/types/paginatedResponse";

export interface BookFilterParams {
    page?: number;
    size?: number;
    category_id?: number;
    author_id?: number;
    rating_star?: number;
    sort_by?: "on_sale" | "popularity" | "price_asc" | "price_desc";
}

const API_BASE_ROUTE = "/api/v1/books";
export const bookService = {
    getOnSale: () => axiosClient.get<Book[]>(`${API_BASE_ROUTE}/on-sale`),
    getPopular: () => axiosClient.get<Book[]>(`${API_BASE_ROUTE}/on-sale`),
    getById: (id: number) => axiosClient.get<Book>(`${API_BASE_ROUTE}/${id}`),
    getBooks: (params: BookFilterParams = {}) => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append("page", params.page.toString());
        if (params.size) queryParams.append("size", params.size.toString());

        if (params.category_id) queryParams.append("category_id", params.category_id.toString());
        if (params.author_id) queryParams.append("author_id", params.author_id.toString());
        if (params.rating_star) queryParams.append("rating_star", params.rating_star.toString());

        if (params.sort_by) {
            if (params.sort_by === "price_asc") {
                queryParams.append("sort_by", "price");
                queryParams.append("sort_direction", "asc");
            } else if (params.sort_by === "price_desc") {
                queryParams.append("sort_by", "price");
                queryParams.append("sort_direction", "desc");
            } else {
                queryParams.append("sort_by", params.sort_by);
                queryParams.append("sort_direction", "desc");
            }
        }

        const queryString = queryParams.toString();
        return axiosClient.get<PaginatedResponse<Book>>(`${API_BASE_ROUTE}?${queryString}`);
    },
};
