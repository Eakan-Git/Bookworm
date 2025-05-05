import { useForm } from "react-hook-form";
import { ReviewFormValues } from "@/types/review";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ReviewFormProps {
    bookId: number;
    onSubmit: (data: ReviewFormValues) => Promise<boolean>;
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useTranslation(["bookdetails", "common"]);

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
                <h1 className="font-bold text-xl">{t("bookdetails:review_form.title")}</h1>
            </div>
            <div className="flex flex-col gap-4 px-8 py-4">
                <div className="flex flex-col">
                    <div className="label p-0 pb-2">
                        <span className="text-sm text-base-content font-bold whitespace-normal break-words w-full">{t("bookdetails:review_form.title_label")}</span>
                    </div>
                    <input
                        type="text"
                        className={`input w-full ${errors.review_title ? 'input-error' : ''}`}
                        {...register("review_title", {
                            required: t("bookdetails:review_form.validation.title_required"),
                            maxLength: {
                                value: 120,
                                message: t("bookdetails:review_form.validation.title_max_length")
                            }
                        })}
                    />
                    {errors.review_title && (
                        <p className="text-error text-sm mt-1">{errors.review_title.message}</p>
                    )}
                </div>
                <div className="flex flex-col">
                    <div className="label p-0 pb-2">
                        <span className="text-sm text-base-content font-bold whitespace-normal break-words w-full">
                            {t("bookdetails:review_form.details_label")}
                        </span>
                    </div>
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
                    <div className="label p-0 pb-2">
                        <span className="text-sm text-base-content font-bold whitespace-normal break-words w-full">{t("bookdetails:review_form.rating_label")}</span>
                    </div>
                    <select
                        className={`select w-full ${errors.rating_star ? 'select-error' : ''}`}
                        {...register("rating_star", {
                            required: t("bookdetails:review_form.validation.rating_required"),
                            min: {
                                value: 1,
                                message: t("bookdetails:review_form.validation.rating_min")
                            },
                            max: {
                                value: 5,
                                message: t("bookdetails:review_form.validation.rating_max")
                            }
                        })}
                    >
                        <option value={1}>{t("bookdetails:review_form.star_options.1_star")}</option>
                        <option value={2}>{t("bookdetails:review_form.star_options.2_stars")}</option>
                        <option value={3}>{t("bookdetails:review_form.star_options.3_stars")}</option>
                        <option value={4}>{t("bookdetails:review_form.star_options.4_stars")}</option>
                        <option value={5}>{t("bookdetails:review_form.star_options.5_stars")}</option>
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
                            {t("bookdetails:review_form.submitting")}
                        </>
                    ) : (
                        t("bookdetails:review_form.submit")
                    )}
                </button>
            </div>
        </form>
    );
}