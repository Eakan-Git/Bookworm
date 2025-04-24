import { useParams } from 'react-router-dom';
import PageLayout from "@/layouts/PageLayout";
import { bookService } from "@/api/bookService";
import { useQuery } from "@tanstack/react-query";
import { Book } from '@/types/book';
import BookDetail from "@/components/BookDetails/BookDetail";
import AddToCart from "@/components/BookDetails/AddToCart";
import CloseOnClickOutSideModal from "@/components/CloseOnClickOutSideModal";
import { useState } from "react";

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
            </PageLayout>
            <CloseOnClickOutSideModal modalId="add-to-cart-modal">
                {modalContent}
            </CloseOnClickOutSideModal>
        </>
    );
}
