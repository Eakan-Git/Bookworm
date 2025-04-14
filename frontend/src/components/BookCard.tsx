import { Book } from "@/types/book";

export default function BookCard({ book }: { book: Book }) {
    return (
        <div className="card bg-base-100 w-56 h-96 shadow-sm rounded-sm hover:shadow-lg transition-shadow duration-300">
            <figure className="w-full h-80 overflow-hidden">
                <img
                    src={book.book_cover_photo}
                    alt={book.book_title}
                    className="w-full h-full object-cover"
                />
            </figure>
            <div className="card-body p-4 flex flex-col gap-2">
                <h2 className="card-title text-base line-clamp-2">{book.book_title}</h2>
                <div>
                    {book.discount_price && (
                        <span className="line-through mr-2">{book.book_price}</span>
                    )}
                    <span className="text-lg font-semibold">{book.discount_price || book.book_price}</span>
                </div>
            </div>
        </div>
    );
}