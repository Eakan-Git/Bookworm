import { Book } from "@/types/book";
import { useTranslation } from "react-i18next";

export default function BookDetail({ book }: { book: Book }) {
    const { t } = useTranslation("bookdetails");

    return (
        <div className="flex flex-col md:flex-row border border-base-content/20 rounded-sm overflow-hidden">
            {/* Left side */}
            <div className="w-full md:w-2/5 min-w-2/5 flex flex-col justify-between pb-4">
                <div className="w-full h-96">
                    <img
                        src={book.book_cover_photo}
                        alt={book.book_title}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "/images/book.png";
                        }}
                        className="w-full h-full object-cover"
                    />
                </div>
                <p className="text-sm pt-4 text-center md:text-right">
                    {t("book_details.by_author")} <span className="font-bold">{book.author.author_name}</span>
                </p>
            </div>

            {/* Right side */}
            <div className="flex-1 flex flex-col gap-4 p-6">
                <h1 className="text-xl font-bold line-clamp-2">{book.book_title}</h1>
                <p className="text-justify text-sm">{book.book_summary}</p>
            </div>
        </div>
    );
}
