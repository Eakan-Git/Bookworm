import { ChevronDown } from "lucide-react";
import BookReview from "@components/BookDetails/BookReview";
import { ReviewsResponse } from "@/types/review";

export default function BookReviews({ reviews }: { reviews: ReviewsResponse }) {
    return (
        <div className="flex flex-col gap-4 border border-base-content/20 rounded-sm p-8">
            <div className="flex items-center gap-2">
                <h2 className="font-bold text-2xl">Customer Reviews</h2>
                <p className="text-sm text-base-content/70"> (Filtered by {5} stars)</p>
            </div>
            <h2 className="text-3xl font-bold">{4.6} Stars</h2>
            <div className="flex gap-4">
                <p>({3134})</p>
                <div className="flex gap-2">
                    <p>5 stars ({200})</p>
                    <p>4 stars ({100})</p>
                    <p>3 stars ({100})</p>
                    <p>2 stars ({100})</p>
                    <p>1 star ({0})</p>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <p>Showing {1}-{12} of {3134} reviews</p>
                <div className="flex gap-2">
                    <select className="select"><ChevronDown />
                        <option selected>Sort by date: Newest to oldest</option>
                        <option>Sort by date: Oldest to newest</option>
                    </select>
                    <select className="select"><ChevronDown />
                        <option value={20} selected>Show 20</option>
                        <option value={50}>Show 50</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-col gap-4 mt-4">
                {reviews.data.map(review =>
                    <div className="flex flex-col">
                        <BookReview review={review} />
                        <div className="divider" />
                    </div>
                )}
            </div>
        </div>
    );
}