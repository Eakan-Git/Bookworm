import { Category } from "@/types/category";
import { Author } from "@/types/author";
import { Discount } from "@/types/discount";
import { Paginate } from "@/types/paginate";

interface Rating {
    average_rating: number;
    review_count: number;
}

export interface Book {
    id: number;
    category: Category;
    author: Author;
    book_title: string;
    book_summary: string;
    book_price: number;
    discount: Discount;
    book_cover_photo: string;
    rating?: Rating;
}

export interface BookFilterParams extends Paginate {
    category_id?: number;
    author_id?: number;
    rating_star?: number;
    sort_by?: "on_sale" | "popularity" | "price_asc" | "price_desc";
}