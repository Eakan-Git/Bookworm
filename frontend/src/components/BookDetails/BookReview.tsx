import { Review } from "@/types/review";
export default function BookReview({ review }: { review: Review }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{review.review_title}</h2>
                <div className="hidden md:flex items-center gap-2">
                    <p>|</p>
                    <p className="text-sm text-base-content/70">({review.rating_star > 1 ? `${review.rating_star} stars` : `${review.rating_star} star`})</p>
                </div>
            </div>
            <div className="md:hidden">
                <p className="text-sm text-base-content/70">({review.rating_star > 1 ? `${review.rating_star} stars` : `${review.rating_star} star`})</p>
            </div>
            <p className="text-base-content">{review.review_details}</p>
            <p className="text-sm text-base-content/70">{review.review_date}</p>
        </div>
    );
}