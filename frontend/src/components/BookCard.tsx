import { Book } from '@/types/book';
import { Link } from 'react-router-dom';
import PriceDisplay from '@/components/PriceDisplay/PriceDisplay';

export default function BookCard({ book }: { book: Book }) {
    return (
        <Link to={`/books/${book.id}`} target='_blank' className="w-full block">
            <div className="card bg-base-100 w-full shadow-sm rounded-sm hover:shadow-lg hover:cursor-pointer transition-shadow duration-300 h-full">
                <figure className="w-full h-52 sm:h-64 md:h-72 overflow-hidden">
                    <img
                        src={book.book_cover_photo || "/images/book.png"}
                        alt={book.book_title}
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "/images/book.png";
                        }}
                        className="w-full h-full object-cover"
                    />
                </figure>

                <div className="flex-1 flex flex-col justify-between">
                    <div className="card-body p-4 pt-3 pb-2">
                        <h2 className="card-title text-base font-semibold leading-snug line-clamp-2 h-12 overflow-hidden">
                            {book.book_title}
                        </h2>
                        <h3 className="text-sm text-gray-600 line-clamp-1 overflow-hidden">
                            {book.author.author_name}
                        </h3>
                    </div>

                    <div className="bg-base-200 px-4 py-3 h-14 flex items-center gap-2">
                        {book.discount?.discount_price && (
                            <span className="line-through text-sm">
                                <PriceDisplay price={book.book_price} />
                            </span>
                        )}
                        <span className="text-lg font-semibold">
                            <PriceDisplay price={book.discount?.discount_price || book.book_price} />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}