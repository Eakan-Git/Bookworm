import { Book } from "@/types/book";
import BookCard from "@/components/BookCard";

interface BookCardGridProps {
    books: Book[];
    className?: string;
}

export default function BookCardGrid({ books, className }: BookCardGridProps) {
    return (
        <div className={`w-full mx-auto px-4 ${className || ''}`}>
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

interface BookCardGridSkeletonProps {
    items?: number;
}

export function BookCardGridSkeleton({ items = 8 }: BookCardGridSkeletonProps) {
    return (
        <div className="w-full mx-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(items)].map((_, index) => (
                    <div key={index} className="w-full">
                        <div className="flex w-52 flex-col gap-4">
                            <div className="skeleton h-32 w-full"></div>
                            <div className="skeleton h-4 w-28"></div>
                            <div className="skeleton h-4 w-full"></div>
                            <div className="skeleton h-4 w-full"></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="skeleton h-8 w-72 mx-auto mt-8"></div>
        </div>
    );
}