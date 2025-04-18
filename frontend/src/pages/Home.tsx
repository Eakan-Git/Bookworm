import CollectionContainer from "@/components/CollectionContainer";
import { ChevronRight } from "lucide-react";
import BooksCarousel from "@/components/BooksCarousel/BooksCarousel";
import { useNavigate } from 'react-router-dom';
import { bookService } from "@/api/bookService";
import { useQuery } from '@tanstack/react-query'

export default function Home() {
    const navigate = useNavigate();
    const onSaleHeaderContent = (
        <div className="flex items-center justify-between my-4">
            <h1 className="text-3xl font-bold">On Sale</h1>
            <button className="btn btn-info text-info-content rounded-sm" onClick={() => {
                navigate('/books/on-sale');
            }}>
                View All
                <ChevronRight className="ml-2" />
            </button>
        </div>
    );
    const { data: onSaleBooks } = useQuery({
        queryKey: ['books'],
        queryFn: () => bookService.getOnSale(),
    });
    return (
        <CollectionContainer
            header={onSaleHeaderContent}
        >
            <BooksCarousel books={onSaleBooks?.data || []} />
        </CollectionContainer>
    );
}