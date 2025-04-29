from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from api.v1.schemas.book import BookRead, BookReadSimple, BookReadSimpleWithReviewCount
from api.v1.schemas.query import BookFilter, ReviewFilter, ReviewSortField, SortDirection
from api.v1.schemas.common import PaginatedResponse, PaginationMeta
from api.v1.schemas.review import ReviewRead
from models.book import Book
from models.review import Review
from models.discount import Discount
from api.v1.services.discount import DiscountService
from api.v1.services.author import AuthorService
from api.v1.services.category import CategoryService
from api.v1.services.review import ReviewService
from datetime import date
from sqlalchemy.orm import joinedload
from sqlalchemy import desc, or_, func, case


class BookService:
    @staticmethod
    def get_books(db: Session, filter_params: BookFilter) -> PaginatedResponse[BookReadSimple]:
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

        discount_amount = (Book.book_price - Discount.discount_price).label("discount_amount")

        books = (
            db.query(Book)
            .join(Discount, Book.id == Discount.book_id)
            .filter(
                or_(
                    Discount.discount_end_date == None,
                    Discount.discount_end_date > today,
                )
            )
            .options(joinedload(Book.discounts))
            .order_by(desc(discount_amount))
            .limit(10)
            .all()
        )

        result = []
        for book in books:
            author = AuthorService.get_author_by_id(book.author_id, db)
            category = CategoryService.get_category_by_id(book.category_id, db)

            valid_discounts = [
                d for d in book.discounts
                if d.discount_end_date is None or d.discount_end_date > today
            ]

            valid_discounts.sort(key=lambda d: book.book_price - d.discount_price, reverse=True)

            book_dict = book.__dict__.copy()
            book_dict["discount"] = valid_discounts[0] if valid_discounts else None
            book_dict["author"] = author
            book_dict["category"] = category
            result.append(BookReadSimple.model_validate(book_dict))

        return result

    @staticmethod
    def get_popular_books(db: Session) -> List[BookReadSimpleWithReviewCount]:
        today = date.today()

        valid_discounts = (
            db.query(
                Discount.book_id,
                func.min(Discount.discount_price).label("discount_price")
            )
            .filter(
                or_(
                    Discount.discount_end_date == None,
                    Discount.discount_end_date > today
                )
            )
            .group_by(Discount.book_id)
            .subquery()
        )

        final_price = case(
            (valid_discounts.c.discount_price.is_(None), Book.book_price),
            else_=Book.book_price - valid_discounts.c.discount_price
        ).label("final_price")

        query_result = (
            db.query(
                Book.id.label("book_id"),
                Book,
                func.count(Review.id).label("review_count"),
                final_price
            )
            .outerjoin(Review, Book.id == Review.book_id)
            .outerjoin(valid_discounts, Book.id == valid_discounts.c.book_id)
            .options(joinedload(Book.discounts))
            .group_by(Book.id, valid_discounts.c.discount_price)
            .order_by(desc("review_count"), desc("final_price"))
            .limit(8)
            .all()
        )

        result = []
        for row in query_result:
            book = row.Book
            review_count = row.review_count

            author = AuthorService.get_author_by_id(book.author_id, db)
            category = CategoryService.get_category_by_id(book.category_id, db)

            valid_book_discounts = [
                d for d in book.discounts
                if d.discount_end_date is None or d.discount_end_date > today
            ]

            book_dict = book.__dict__.copy()
            book_dict["discount"] = valid_book_discounts[0] if valid_book_discounts else None
            book_dict["author"] = author
            book_dict["category"] = category
            book_dict["review_count"] = review_count
            result.append(BookReadSimpleWithReviewCount.model_validate(book_dict))

        return result

    @staticmethod
    def get_reviews_by_book_id(book_id: int, filter_params: ReviewFilter, db: Session) -> PaginatedResponse[ReviewRead]:
        query = db.query(Review).filter(Review.book_id == book_id)

        if filter_params.rating_star is not None:
            query = query.filter(Review.rating_star == filter_params.rating_star)

        if filter_params.sort_by == ReviewSortField.DATE:
            if filter_params.sort_direction == SortDirection.ASC:
                query = query.order_by(Review.review_date.asc())
            else:
                query = query.order_by(Review.review_date.desc())

        total_count = query.count()

        total_pages = (total_count + filter_params.size - 1) // filter_params.size if total_count > 0 else 0

        offset = (filter_params.page - 1) * filter_params.size
        query = query.offset(offset).limit(filter_params.size)

        reviews = query.all()

        review_data = []
        for review in reviews:
            review_dict = {
                "id": review.id,
                "book_id": review.book_id,
                "review_title": review.review_title,
                "review_details": review.review_details,
                "rating_star": review.rating_star,
                "review_date": review.review_date
            }
            review_data.append(ReviewRead.model_validate(review_dict))

        return PaginatedResponse[ReviewRead](
            data=review_data,
            meta=PaginationMeta(
                total=total_count,
                total_pages=total_pages,
                page=filter_params.page,
                size=filter_params.size
            )
        )
