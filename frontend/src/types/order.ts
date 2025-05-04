export interface PlacedOrderItem {
    book_id: number;
    quantity: number;
    price: number;
}

export interface PriceMismatchError {
    id: number;
    book_title: string;
    book_summary?: string;
    book_price?: number;
    book_cover_photo?: string;
    expected_price: number;
    actual_price: number;
    category?: {
        id: number;
        category_name: string;
        category_desc?: string;
    };
    author?: {
        id: number;
        author_name: string;
        author_bio?: string;
    };
    discount?: {
        id: number;
        book_id: number;
        discount_price?: number;
        discount_start_date?: string;
        discount_end_date?: string;
    };
}

export interface PriceMismatchResponse {
    mismatches: PriceMismatchError[];
}
