import CollectionContainer from "@/components/CollectionContainer";
import BookCard from "@/components/BookCard";
import { books } from "@/data/books";
import { ChevronRight } from "lucide-react";

const headerContent = (
    <div className="flex items-center justify-between mt-4">
        <h1 className="text-3xl font-bold">On Sale</h1>
        <button className="btn btn-info text-primary-content rounded-sm">
            View more
            <ChevronRight className="ml-2" />
        </button>
    </div>
);

export default function Home() {
    return (
        <div className="w-11/12 mx-auto pb-4">
            <CollectionContainer
                header={headerContent}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {books.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            </CollectionContainer>
        </div>
    );
}