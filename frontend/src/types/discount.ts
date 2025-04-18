export interface Discount {
    id: number;
    discount_start_date: Date;
    discount_end_date: Date;
    discount_price: number;
    book_id: number;
}