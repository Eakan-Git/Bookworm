import { Book } from "@/types/book";
import BookCard from "@components/BookCard";

export default function BookCardGrid({ books }: { books: Book[] }) {
    return (
        <div className="w-full md:max-w-10/12 mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {books.map((book) => (
                    <div key={book.id} className="w-full">
                        <BookCard book={book} />
                    </div>
                ))}
            </div>
        </div>
    );
}