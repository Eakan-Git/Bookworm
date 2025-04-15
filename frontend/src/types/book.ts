export interface Book {
    id: number;
    category_name: string;
    author_name: string;
    book_title: string;
    book_price: number;
    discount_price?: number;
    book_cover_photo: string;
}
