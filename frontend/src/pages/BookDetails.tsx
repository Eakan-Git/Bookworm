import { useParams } from 'react-router-dom';
import PageLayout from "@/layouts/PageLayout";
import { bookService } from "@/api/bookService";
import { useQuery } from "@tanstack/react-query";
import { Book } from '@/types/book';
import BookDetail from "@/components/BookDetails/BookDetail";
import AddToCart from "@/components/BookDetails/AddToCart";
import BookReviews from '@/components/BookDetails/BookReviews';
import CloseOnClickOutSideModal from "@/components/CloseOnClickOutSideModal";
import { useState } from "react";
import ReviewForm from '@/components/ReviewForm/ReviewForm';
import { ReviewsResponse } from "@/types/review";

export default function BookDetails() {
    const { id } = useParams();
    if (!id) return null;
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);
    const {
        data: book,
        isPending,
        error,
    } = useQuery<Book>({
        queryKey: ['book', Number(id)],
        queryFn: () => bookService.getById(Number(id)).then(res => res.data),
        retry: false,
    });

    if (isPending) return <PageLayout pageTitle="Loading...">Loading...</PageLayout>;

    const reviews: ReviewsResponse = {
        data: [
            {
                id: 1,
                book_id: 1,
                review_title: "Test Review Title",
                review_details: "Review Details: Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                review_date: "2021-01-01",
                rating_star: 5,
            },
            {
                id: 2,
                book_id: 1,
                review_title: "Test Review Title 2",
                review_details: "Review Details: Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                review_date: "2021-01-01",
                rating_star: 5,
            },
            {
                id: 3,
                book_id: 1,
                review_title: "Test Review Title 3",
                review_details: "Review Details: Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                review_date: "2021-01-01",
                rating_star: 1,
            },
        ],
        meta: {
            total: 3,
            page: 1,
            total_pages: 1,
        }
    };

    if (error) return (
        <PageLayout pageTitle="Error">
            <p>Failed to load book details.</p>
        </PageLayout>
    );

    return (
        <>
            <PageLayout pageTitle={book.category.category_name || 'Category'}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-3/5">
                        <BookDetail book={book} />
                    </div>
                    <div className="w-full md:w-2/5">
                        <AddToCart book={book} onAddToCart={setModalContent} />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 py-8">
                    <div className='w-full md:w-3/5'>
                        <BookReviews reviews={reviews} />
                    </div>
                    <div className='w-full md:w-2/5'>
                        <ReviewForm />
                    </div>
                </div>
            </PageLayout>
            <CloseOnClickOutSideModal modalId="add-to-cart-modal">
                {modalContent}
            </CloseOnClickOutSideModal>
        </>
    );
}
