import {PaginatedResponse} from "@/types/paginatedResponse";

export interface Review {
    id: number;
    book_id: number;
    review_title: string;
    review_details: string;
    review_date: string;
    rating_star: number;
}

export interface ReviewsResponse extends PaginatedResponse<Review> {}