import CollectionContainer from "@/components/CollectionContainer";
import { ChevronRight } from "lucide-react";
import BooksCarousel from "@/components/BooksCarousel/BooksCarousel";
import { useNavigate } from 'react-router-dom';
import { bookService } from "@/api/bookService";
import { useQuery } from '@tanstack/react-query'
import BookCardGrid from "@/components/BookCardGrid/BookCardGrid";
import TabsContainer from "@/components/TabsContainer/TabsContainer";

export default function Home() {
    const navigate = useNavigate();
    const onSaleHeaderContent = (
        <div className="flex items-center justify-between my-4">
            <h1 className="text-3xl font-bold">On Sale</h1>
            <button className="btn btn-accent text-info-content rounded-sm" onClick={() => {
                navigate('/shop');
            }}>
                View All
                <ChevronRight className="ml-2" />
            </button>
        </div>
    );
    const featuredHeaderContent = (
        <div className="flex justify-center items-center my-4">
            <h1 className="text-3xl font-bold">Featured Books</h1>
        </div>
    );
    const { data: onSaleBooks } = useQuery({
        queryKey: ['on-sale'],
        queryFn: () => bookService.getOnSale(),
    });
    const { data: popularBooks } = useQuery({
        queryKey: ['popular'],
        queryFn: () => bookService.getPopular(),
    });
    return (
        <>
            <CollectionContainer
                header={onSaleHeaderContent}
            >
                <BooksCarousel books={onSaleBooks?.data || []} />
            </CollectionContainer>

            <TabsContainer
                header={featuredHeaderContent}
                tabs={[
                    {
                        name: "Recommended",
                        content: <BookCardGrid books={popularBooks?.data || []} />
                    },
                    {
                        name: "Popular",
                        content: <BookCardGrid books={[...(onSaleBooks?.data || [])].reverse()} />
                    }
                ]}
            />
        </>
    );
}