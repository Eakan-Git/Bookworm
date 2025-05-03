import { PaginatedResponse } from "@/types/paginatedResponse";
import { Paginate } from "@/types/paginate";

export interface Review {
    id: number;
    book_id: number;
    review_title: string;
    review_details?: string;
    review_date: string;
    rating_star: number;
}

export interface ReviewFilterParams extends Paginate {
    rating_star?: number;
    sort_by?: "date";
    sort_direction?: "asc" | "desc";
}

export interface ReviewFormValues {
    review_title: string;
    review_details?: string;
    rating_star: number;
}

export interface ReviewsResponse extends PaginatedResponse<Review> {}