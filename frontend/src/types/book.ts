import { Category } from "@/types/category";
import { Author } from "@/types/author";
import { Discount } from "@/types/discount";

interface Rating {
    average_rating: number;
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
