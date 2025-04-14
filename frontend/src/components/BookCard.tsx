import { Book } from '@/types/book';
import { useNavigate } from 'react-router-dom';

export default function BookCard({ book }: { book: Book }) {
    const navigate = useNavigate();
    return (
        <div className="card bg-base-100 w-full max-w-64 h-96 shadow-sm rounded-sm hover:shadow-lg hover:cursor-pointer transition-shadow duration-300 flex flex-col"
            onClick={() => {
                navigate(`/books/${book.id}`);
            }}
        >
            <figure className="w-full h-48 overflow-hidden">
                <img
                    src={book.book_cover_photo}
                    alt={book.book_title}
                    className="w-full h-full object-cover"
                />
            </figure>

            <div className="flex-1 flex flex-col justify-between">
                <div className="card-body p-4 pt-3 pb-2">
                    <h2 className="card-title text-base font-semibold leading-snug line-clamp-2 h-10">
                        {book.book_title}
                    </h2>
                    <h3 className="text-sm text-base line-clamp-2 h-10">
                        {book.author_name}
                    </h3>
                </div>

                <div className="bg-base-200 px-4 py-3 h-14 flex items-center gap-2">
                    {book.discount_price && (
                        <span className="line-through text-sm">
                            {book.book_price}
                        </span>
                    )}
                    <span className="text-lg font-semibold">
                        {book.discount_price || book.book_price}
                    </span>
                </div>
            </div>
        </div>
    );
}
