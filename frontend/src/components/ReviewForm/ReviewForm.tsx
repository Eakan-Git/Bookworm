import { useForm } from "react-hook-form";
import { ReviewFormValues } from "@/types/review";
import { useState } from "react";

interface ReviewFormProps {
    bookId: number;
    onSubmit: (data: ReviewFormValues) => Promise<boolean>;
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ReviewFormValues>({
        defaultValues: {
            review_title: "",
            review_details: "",
            rating_star: 5
        }
    });

    const onSubmitForm = async (data: ReviewFormValues) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const success = await onSubmit(data);
            if (success) {
                reset(); // Reset form on successful submission
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-4 border border-base-content/20 rounded-sm">
            <div className="px-8 py-4 bg-base-200 border-b border-base-content/20">
                <h1 className="font-bold text-xl">Write a Review</h1>
            </div>
            <div className="flex flex-col gap-4 px-8 py-4">
                <div className="flex flex-col">
                    <label className="label text-sm text-base-content font-bold">Add a title *</label>
                    <input
                        type="text"
                        className={`input w-full ${errors.review_title ? 'input-error' : ''}`}
                        {...register("review_title", {
                            required: "Review title is required",
                            maxLength: {
                                value: 120,
                                message: "Title must be less than 120 characters"
                            }
                        })}
                    />
                    {errors.review_title && (
                        <p className="text-error text-sm mt-1">{errors.review_title.message}</p>
                    )}
                </div>
                <div className="flex flex-col">
                    <label className="label text-sm text-base-content font-bold">
                        Details please! Your review helps other shoppers
                    </label>
                    <textarea
                        className={`textarea w-full ${errors.review_details ? 'textarea-error' : ''}`}
                        {...register("review_details")}
                        rows={5}
                    />
                    {errors.review_details && (
                        <p className="text-error text-sm mt-1">{errors.review_details.message}</p>
                    )}
                </div>
                <div className="flex flex-col">
                    <label className="label text-sm text-base-content font-bold">Select a rating star *</label>
                    <select
                        className={`select w-full ${errors.rating_star ? 'select-error' : ''}`}
                        {...register("rating_star", {
                            required: "Rating is required",
                            min: {
                                value: 1,
                                message: "Rating must be at least 1 star"
                            },
                            max: {
                                value: 5,
                                message: "Rating cannot exceed 5 stars"
                            }
                        })}
                    >
                        <option value={1}>1 Star</option>
                        <option value={2}>2 Stars</option>
                        <option value={3}>3 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={5}>5 Stars</option>
                    </select>
                    {errors.rating_star && (
                        <p className="text-error text-sm mt-1">{errors.rating_star.message}</p>
                    )}
                </div>
            </div>
            <div className="flex border-t border-base-content/20 p-4 justify-center">
                <button
                    type="submit"
                    className="btn btn-primary text-bold text-lg rounded-sm"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Submitting...
                        </>
                    ) : (
                        'Submit Review'
                    )}
                </button>
            </div>
        </form>
    );
}