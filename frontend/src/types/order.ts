export interface PlacedOrderItem {
    book_id: number;
    quantity: number;
    price: number;
}

import { Book } from "@/types/book";

export interface PriceMismatchResponse {
    mismatches: Book[];
}
