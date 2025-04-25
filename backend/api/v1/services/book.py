from sqlalchemy.orm import Session
from typing import Tuple, List, Optional

from api.v1.schemas.book import BookRead, BookReadSimple
from api.v1.schemas.query import BookFilter
from models.book import Book
from models.discount import Discount
from api.v1.services.discount import DiscountService
from api.v1.services.author import AuthorService
from api.v1.services.category import CategoryService
from api.v1.services.review import ReviewService
from datetime import date
from sqlalchemy.orm import joinedload
from sqlalchemy import desc, or_


class BookService:
    @staticmethod
    def get_books(db: Session, filter_params: BookFilter) -> Tuple[List[BookRead], int]:
        pass

    @staticmethod
    def get_book_by_id(book_id: int, db: Session) -> Optional[BookRead]:
        book = db.query(Book).filter(Book.id == book_id).first()
        if not book:
            return None
        discount = DiscountService.get_current_discount_for_book(book_id, db)
        author = AuthorService.get_author_by_id(book.author_id, db)
        category = CategoryService.get_category_by_id(book.category_id, db)
        average_rating = ReviewService.get_average_rating_for_book(book_id, db)
        book_dict = {**book.__dict__}
        book_dict["discount"] = discount
        book_dict["author"] = author
        book_dict["category"] = category
        book_dict["rating"] = average_rating
        return BookRead.model_validate(book_dict)

    @staticmethod
    def get_on_sale_books(db: Session) -> List[BookReadSimple]:
        today = date.today()

        books = (
            db.query(Book)
            .join(Discount, Book.id == Discount.book_id)
            .options(joinedload(Book.discounts))
            .filter(
                or_(
                    Discount.discount_end_date == None,
                    Discount.discount_end_date > today,
                )
            )
            .order_by(desc(Book.book_price - Discount.discount_price))
            .limit(10)
            .all()
        )

        result = []
        for book in books:
            author = AuthorService.get_author_by_id(book.author_id, db)

            book_dict = book.__dict__.copy()
            book_dict["discount"] = book.discounts[0]
            book_dict["author"] = author
            result.append(BookRead.model_validate(book_dict))

        return result
