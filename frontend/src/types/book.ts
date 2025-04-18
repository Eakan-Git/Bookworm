import { Category } from "@/types/category";
import { Author } from "@/types/author";
import { Discount } from "@/types/discount";
export interface Book {
    id: number;
    category: Category;
    author: Author;
    book_title: string;
    book_price: number;
    discount: Discount;
    book_cover_photo: string;
}
