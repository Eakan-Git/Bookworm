import { Book } from "@/types/book";

export interface CartItem extends Book {
    quantity: number;
}