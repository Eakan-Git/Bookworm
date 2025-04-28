import BookReview from "@components/BookDetails/BookReview";
import { ReviewsResponse } from "@/types/review";
import Pagination from "@components/Pagination/Pagination";
import { PaginationData } from "@/types/paginate";
import { useEffect, useState } from "react";

export default function BookReviews() {
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
            total_pages: 30,
        }
    };
    const [size, setSize] = useState(reviews.meta.size || 20);

    // Initialize pagination data based on the reviews response
    const [paginationData, setPaginationData] = useState<PaginationData>({
        current_page: reviews.meta.page || 1,
        total_pages: reviews.meta.total_pages || 1,
    });

    // Handle page change
    const handlePaginationChange = (page: number) => {
        // Update local state
        setPaginationData({ ...paginationData, current_page: page });

        // Here you would typically fetch new data with the updated page
        // For example, call an API function or dispatch an action
        // fetchReviews({ page, size: 20 });
    };

    // Calculate display information
    const totalReviews = reviews.meta.total || 0;
    const startItem = ((paginationData.current_page - 1) * size) + 1;
    const endItem = Math.min(paginationData.current_page * size, totalReviews);

    return (
        <div className="flex flex-col gap-4 border border-base-content/20 rounded-sm p-8">
            <div className="flex items-center gap-2">
                <h2 className="font-bold text-2xl">Customer Reviews</h2>
                <p className="text-sm text-base-content/70"> (Filtered by {5} stars)</p>
            </div>
            <h2 className="text-3xl font-bold">{4.6} Stars</h2>
            <div className="flex gap-4">
                <p>({totalReviews})</p>
                <div className="flex gap-2">
                    <p>5 stars ({200})</p>
                    <p>4 stars ({100})</p>
                    <p>3 stars ({100})</p>
                    <p>2 stars ({100})</p>
                    <p>1 star ({0})</p>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <p>Showing {startItem}-{endItem} of {totalReviews} reviews</p>
                <div className="flex gap-2">
                    <select className="select select-bordered">
                        <option value="newest">Sort by date: Newest to oldest</option>
                        <option value="oldest">Sort by date: Oldest to newest</option>
                    </select>
                    <select
                        className="select select-bordered"
                        onChange={() => {
                            // Here you would handle size change
                            // For example: fetchReviews({ page: 1, size: Number(e.target.value) })
                        }}
                    >
                        <option value="20">Show 20</option>
                        <option value="50">Show 50</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-col gap-4 mt-4">
                {reviews.data.map((review, index) => (
                    <div className="flex flex-col" key={review.id || index}>
                        <BookReview review={review} />
                        <div className="divider" />
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-4">
                <Pagination data={paginationData} onChange={handlePaginationChange} />
            </div>
        </div>
    );
}