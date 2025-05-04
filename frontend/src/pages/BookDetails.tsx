import { useParams } from 'react-router-dom';
import PageLayout from "@/layouts/PageLayout";
import { bookService } from "@/api/bookService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import BookDetail from "@/components/BookDetails/BookDetail";
import AddToCart from "@/components/BookDetails/AddToCart";
import BookReviews from '@/components/BookDetails/BookReviews';
import CloseOnClickOutSideModal from "@/components/CloseOnClickOutSideModal";
import { useState, useCallback, memo } from "react";
import ReviewForm from '@/components/ReviewForm/ReviewForm';
import { ReviewFilterParams, ReviewFormValues } from "@/types/review";
import { Book } from "@/types/book";
import { ReviewsResponse } from "@/types/review";

// Add the reviewCountdownTimer property to the Window interface
declare global {
    interface Window {
        reviewCountdownTimer?: number;
    }
}

const ReviewsSection = memo(({
    reviews,
    isLoading,
    error,
    filters,
    onFilterChange,
    book
}: {
    reviews: ReviewsResponse | undefined;
    isLoading: boolean;
    error: Error | null;
    filters: ReviewFilterParams;
    onFilterChange: (filters: Partial<ReviewFilterParams>) => void;
    book: Book | undefined;
}) => {
    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-64">
            <p>Failed to load reviews. Please try again.</p>
        </div>
    );

    if (!reviews) return null;

    return (
        <BookReviews
            reviews={reviews}
            onFilterChange={onFilterChange}
            filters={filters}
            book={book}
        />
    );
});

export default function BookDetails() {
    const { id } = useParams();
    if (!id) return null;

    const bookId = Number(id);
    const queryClient = useQueryClient();
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);
    const [reviewFilters, setReviewFilters] = useState<ReviewFilterParams>({
        page: 1,
        size: 10,
        sort_by: "date",
        sort_direction: "desc"
    });

    // Fetch book details
    const {
        data: book,
        isPending: isBookLoading,
        error: bookError,
        refetch: refetchBook
    } = useQuery({
        queryKey: ['book', bookId],
        queryFn: () => bookService.getById(bookId).then(res => res.data),
        retry: false,
    });

    // Fetch reviews
    const {
        data: reviews,
        isPending: isReviewsLoading,
        error: reviewsError,
        refetch: refetchReviews
    } = useQuery({
        queryKey: ['reviews', bookId, reviewFilters],
        queryFn: () => bookService.getReviews(bookId, reviewFilters).then(res => res.data),
        retry: false,
    });

    // Handle review filter changes
    const handleReviewFilterChange = useCallback((newFilters: Partial<ReviewFilterParams>) => {
        setReviewFilters(prev => ({
            ...prev,
            ...newFilters,
            // Reset to page 1 when filters change
            ...(Object.keys(newFilters).some(key => key !== 'page') ? { page: 1 } : {})
        }));
    }, []);

    // Handle review submission
    const handleReviewSubmit = useCallback(async (reviewData: ReviewFormValues) => {
        try {
            await bookService.createReview(bookId, reviewData);

            // Set up a countdown in the modal
            let countdown = 5;

            // Create the modal content with initial countdown value
            const updateModalContent = () => {
                setModalContent(
                    <>
                        <h3 className="text-lg pb-4">Thank you for your review!</h3>
                        <p className="text-base-content">Your review has been submitted successfully.</p>
                        <br />
                        <p className="text-base-content text-center font-bold">Closing in {countdown} seconds...</p>
                        <div className="modal-action">
                            <button className="btn btn-secondary" onClick={() => {
                                // Refetch data immediately when user clicks close
                                queryClient.invalidateQueries({ queryKey: ['book', bookId] });
                                queryClient.invalidateQueries({ queryKey: ['reviews', bookId] });
                                refetchBook();
                                refetchReviews();

                                // Close the modal
                                const dialog = document.getElementById('product-page-modal') as HTMLDialogElement;
                                dialog?.close();

                                // Clear the interval to stop the countdown
                                if (window.reviewCountdownTimer) {
                                    clearInterval(window.reviewCountdownTimer);
                                    window.reviewCountdownTimer = undefined;
                                }
                            }}>Close</button>
                        </div>
                    </>
                );
            };

            // Initial render of modal content
            updateModalContent();

            // Show the modal using direct DOM manipulation
            const dialog = document.getElementById('product-page-modal') as HTMLDialogElement;
            dialog.showModal();

            // Set up the countdown timer
            // Store the timer ID in the window object so we can clear it when the user clicks close
            window.reviewCountdownTimer = setInterval(() => {
                countdown -= 1;

                if (countdown <= 0) {
                    if (window.reviewCountdownTimer) {
                        clearInterval(window.reviewCountdownTimer);
                        window.reviewCountdownTimer = undefined;
                    }

                    // When countdown reaches 0, refetch data and close modal
                    queryClient.invalidateQueries({ queryKey: ['book', bookId] });
                    queryClient.invalidateQueries({ queryKey: ['reviews', bookId] });
                    refetchBook();
                    refetchReviews();

                    // Close the modal
                    dialog?.close();
                    setModalContent(null);
                } else {
                    updateModalContent();
                }
            }, 1000);

            return true;
        } catch (error) {
            console.error("Failed to submit review:", error);
            return false;
        }
    }, [bookId, queryClient, refetchBook, refetchReviews]);

    if (isBookLoading) return <PageLayout pageTitle="Loading...">Loading...</PageLayout>;

    if (bookError) return (
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
                        <ReviewsSection
                            reviews={reviews}
                            isLoading={isReviewsLoading}
                            error={reviewsError}
                            filters={reviewFilters}
                            onFilterChange={handleReviewFilterChange}
                            book={book}
                        />
                    </div>
                    <div className='w-full md:w-2/5'>
                        <ReviewForm
                            bookId={bookId}
                            onSubmit={handleReviewSubmit}
                        />
                    </div>
                </div>
            </PageLayout>
            <CloseOnClickOutSideModal modalId="product-page-modal">
                {modalContent}
            </CloseOnClickOutSideModal>
        </>
    );
}
