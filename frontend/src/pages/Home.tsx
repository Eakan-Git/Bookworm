import CollectionContainer from "@/components/CollectionContainer";
// import { books } from "@/data/books";
import { ChevronRight } from "lucide-react";
import BooksCarousel from "@/components/BooksCarousel/BooksCarousel";
import { useNavigate } from 'react-router-dom';
import { bookService } from "@/api/bookService";
import { useQuery } from '@tanstack/react-query'

export default function Home() {
    const navigate = useNavigate();
    const headerContent = (
        <div className="flex items-center justify-between mt-4">
            <h1 className="text-3xl font-bold">On Sale</h1>
            <button className="btn btn-info text-info-content rounded-sm" onClick={() => {
                navigate('/books/on-sale');
            }}>
                View All
                <ChevronRight className="ml-2" />
            </button>
        </div>
    );
    const { data: books } = useQuery({
        queryKey: ['books'],
        queryFn: () => bookService.getOnSale(),
    });
    return (
        <div className="w-11/12 mx-auto pb-4">
            <CollectionContainer
                header={headerContent}
            >
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {books.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div> */}
                <BooksCarousel books={books?.data || []} />
            </CollectionContainer>
        </div>
    );
}