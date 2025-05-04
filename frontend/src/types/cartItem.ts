import { Book } from "@/types/book";

export interface CartItem extends Book {
    quantity: number;
    total?: number; // Optional total price (quantity * price)
}