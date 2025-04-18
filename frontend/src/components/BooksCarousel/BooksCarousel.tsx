import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import BookCard from '@components/BookCard';
import { Book } from '@/types/book';

export default function BooksCarousel({ books }: { books: Book[] }) {
  return (
    <div className="w-11/12 mx-auto">
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
        <button
          className="custom-button-prev hidden md:block btn btn-circle"
          aria-label="Previous"
        >
          &#10094;
        </button>

        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: '.custom-button-next',
            prevEl: '.custom-button-prev',
          }}
          loop
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="flex-1"
        >
          {books.map((book) => (
            <SwiperSlide key={book.id}>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          className="custom-button-next hidden md:block btn btn-circle"
          aria-label="Next"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}
