import { Review } from "@/types/review";
import { useState } from "react";
import { useFormatDate } from "@/hooks/useFormatDate";
import { useTranslation } from "react-i18next";

export default function BookReview({ review }: { review: Review }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const formattedDate = useFormatDate(review.review_date);
    const { t } = useTranslation("bookdetails");

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const renderReviewDetails = () => {
        if (!review.review_details) return null;

        if (review.review_details.length <= 255 || isExpanded) {
            return <p className="text-base-content">{review.review_details}</p>;
        }

        return (
            <div>
                <p className="text-base-content">
                    {review.review_details.substring(0, 255)}...
                </p>
                <button
                    onClick={toggleExpand}
                    className="text-sm mt-1 font-medium underline hover:cursor-pointer"
                >
                    {t("reviews.read_more")}
                </button>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{review.review_title}</h2>
                <div className="hidden md:flex items-center gap-2">
                    <p>|</p>
                    <p className="text-sm text-base-content/70">
                        ({review.rating_star} {review.rating_star > 1 ? t("reviews.stars") : t("reviews.star")})
                    </p>
                </div>
            </div>
            <div className="md:hidden">
                <p className="text-sm text-base-content/70">
                    ({review.rating_star} {review.rating_star > 1 ? t("reviews.stars") : t("reviews.star")})
                </p>
            </div>

            {renderReviewDetails()}

            {isExpanded && review.review_details && review.review_details.length > 255 && (
                <button
                    onClick={toggleExpand}
                    className="font-bold underline text-sm font-medium hover:cursor-pointer"
                >
                    {t("reviews.read_less")}
                </button>
            )}

            <p className="text-sm text-base-content/70">
                {t("reviews.posted_on", { date: formattedDate })}
            </p>
        </div>
    );
}