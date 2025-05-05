import BookReview from "@components/BookDetails/BookReview";
import { ReviewFilterParams, ReviewsResponse } from "@/types/review";
import { PaginationData } from "@/types/paginate";
import { useCallback, memo } from "react";
import { Book } from "@/types/book";
import ResponsivePagination from "./ResponsivePagination";
import "./BookReviews.css";
import { useTranslation } from "react-i18next";

interface BookReviewsProps {
    book_review_count?: number;
    reviews: ReviewsResponse;
    onFilterChange: (filters: Partial<ReviewFilterParams>) => void;
    filters: ReviewFilterParams;
    book?: Book;
}

function BookReviews({ reviews, onFilterChange, filters, book }: BookReviewsProps) {
    const { t } = useTranslation("bookdetails");

    // Calculate display information
    const bookReviewCount = book?.rating?.review_count || 0;
    const totalReviews = reviews.meta.total || 0;
    const size = filters.size || 10;
    const currentPage = filters.page || 1;
    const startItem = ((currentPage - 1) * size) + 1;
    const endItem = Math.min(currentPage * size, totalReviews);

    // Pagination data for the pagination component
    const paginationData: PaginationData = {
        current_page: currentPage,
        total_pages: reviews.meta.total_pages || 1,
    };

    // Handle page change
    const handlePaginationChange = useCallback((page: number) => {
        onFilterChange({ page });
    }, [onFilterChange]);

    // Handle size change
    const handleSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({
            size: Number(e.target.value),
            page: 1 // Reset to page 1 when changing size
        });
    }, [onFilterChange]);

    // Handle sort change
    const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === "newest") {
            onFilterChange({
                sort_by: "date",
                sort_direction: "desc"
            });
        } else if (value === "oldest") {
            onFilterChange({
                sort_by: "date",
                sort_direction: "asc"
            });
        }
    }, [onFilterChange]);

    // Handle star filter change
    const handleStarFilterChange = useCallback((star: number | undefined) => {
        onFilterChange({
            rating_star: star,
            page: 1 // Reset to page 1 when changing filter
        });
    }, [onFilterChange]);

    // Get current sort value for select
    const getCurrentSortValue = () => {
        if (filters.sort_by === "date") {
            return filters.sort_direction === "asc" ? "oldest" : "newest";
        }
        return "newest"; // Default
    };

    return (
        <div className="flex flex-col gap-4 border border-base-content/20 rounded-sm p-8">
            <div className="flex items-center gap-2">
                <h2 className="font-bold text-2xl">{t("reviews.title")}</h2>
                {filters.rating_star && (
                    <p className="text-sm text-base-content/70">
                        {t("reviews.filtered_by", {
                            rating: filters.rating_star,
                            stars: filters.rating_star === 1 ? t("reviews.star") : t("reviews.stars")
                        })}
                    </p>
                )}
            </div>

            {/* Star rating summary */}
            {book?.rating?.average_rating !== undefined && (
                <h2 className="text-3xl font-bold">
                    {Number(book.rating.average_rating).toFixed(1)} {t("reviews.stars")}
                </h2>
            )}

            <div className="flex flex-wrap gap-4">
                <p
                    className={`cursor-pointer hover:underline ${filters.rating_star === undefined ? 'font-bold underline' : ''
                        }`}
                    onClick={() => handleStarFilterChange(undefined)}
                >
                    {t("reviews.reviews_count", {
                        count: bookReviewCount,
                        text: bookReviewCount === 1 ? t("reviews.review") : t("reviews.reviews_text")
                    })}
                </p>
                <div className="flex flex-wrap gap-4">
                    {[5, 4, 3, 2, 1].map(star => (
                        <span
                            key={star}
                            className={`cursor-pointer hover:underline ${filters.rating_star === star ? 'font-bold underline' : ''
                                }`}
                            onClick={() => handleStarFilterChange(filters.rating_star === star ? undefined : star)}
                        >
                            {star} {star === 1 ? t("reviews.star") : t("reviews.stars")}
                        </span>
                    ))}
                </div>
            </div>

            {/* Sorting and pagination controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                <p className="text-sm">
                    {totalReviews > 0
                        ? t("reviews.showing_reviews", { start: startItem, end: endItem, total: totalReviews })
                        : t("reviews.no_reviews_found")}
                </p>
                <div className="flex gap-2">
                    <select
                        className="select select-bordered select-sm"
                        value={getCurrentSortValue()}
                        onChange={handleSortChange}
                    >
                        <option value="newest">{t("common:select.sort_newest")}</option>
                        <option value="oldest">{t("common:select.sort_oldest")}</option>
                    </select>
                    <select
                        className="select select-bordered select-sm w-auto"
                        value={size.toString()}
                        onChange={handleSizeChange}
                    >
                        <option value="10">{t("common:pagination.show")} 10</option>
                        <option value="20">{t("common:pagination.show")} 20</option>
                        <option value="50">{t("common:pagination.show")} 50</option>
                    </select>
                </div>
            </div>

            {/* Reviews list */}
            {reviews.data.length > 0 ? (
                <div className="flex flex-col gap-4 mt-4">
                    {reviews.data.map((review, index) => (
                        <div className="flex flex-col" key={review.id || index}>
                            <BookReview review={review} />
                            {index < reviews.data.length - 1 && <div className="divider" />}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center py-8">
                    <p className="text-base-content/70">{t("reviews.no_reviews_found")}</p>
                </div>
            )}

            {/* Pagination */}
            {reviews.meta.total_pages > 1 && (
                <div className="flex justify-center mt-4 overflow-x-auto w-full">
                    <div className="responsive-pagination">
                        <ResponsivePagination data={paginationData} onChange={handlePaginationChange} />
                    </div>
                </div>
            )}
        </div>
    );
}

// Export with memo to prevent unnecessary re-renders
export default memo(BookReviews);