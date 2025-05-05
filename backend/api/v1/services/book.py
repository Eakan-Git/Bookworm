from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from api.v1.schemas.book import BookRead, BookReadSimple, BookReadSimpleWithReviewCount, BookReadSimpleWithRating, BookCreate
from api.v1.schemas.query import BookFilter, ReviewFilter, ReviewSortField, SortDirection, BookSortField
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
from sqlalchemy import desc, or_, func, case


class BookService:
    @staticmethod
    def get_books(db: Session, filter_params: BookFilter) -> PaginatedResponse[BookReadSimpleWithRating]:
        """
        Get paginated books with filtering and sorting options

        Args:
            db: Database session
            filter_params: Filter and pagination parameters

        Returns:
            PaginatedResponse containing list of books and pagination metadata
        """
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

        # Calculate sub price and final price for sorting
        sub_price = case(
            (valid_discounts.c.discount_price.is_(None), 0),
            else_=Book.book_price - valid_discounts.c.discount_price
        ).label("sub_price")

        final_price = case(
            (valid_discounts.c.discount_price.is_(None), Book.book_price),
            else_=valid_discounts.c.discount_price
        ).label("final_price")

        # Create a subquery to get average rating for each book
        avg_ratings = (
            db.query(
                Review.book_id,
                func.round(func.avg(Review.rating_star), 2).label("avg_rating"),
                func.count(Review.id).label("review_count")
            )
            .group_by(Review.book_id)
            .subquery()
        )

        query = (
            db.query(
                Book,
                sub_price,
                final_price,
                func.coalesce(avg_ratings.c.review_count, 0).label("review_count"),
                func.coalesce(avg_ratings.c.avg_rating, 0).label("avg_rating")
            )
            .outerjoin(valid_discounts, Book.id == valid_discounts.c.book_id)
            .outerjoin(avg_ratings, Book.id == avg_ratings.c.book_id)
            .options(joinedload(Book.discounts))
            .group_by(Book.id, valid_discounts.c.discount_price, avg_ratings.c.review_count, avg_ratings.c.avg_rating)
        )

        if filter_params.category_id is not None:
            query = query.filter(Book.category_id == filter_params.category_id)

        if filter_params.author_id is not None:
            query = query.filter(Book.author_id == filter_params.author_id)

        if filter_params.rating_star is not None:
            # Filter books with average rating >= rating_star
            query = query.filter(avg_ratings.c.avg_rating >= filter_params.rating_star)

        if filter_params.sort_by == BookSortField.ON_SALE:
            # Default: Sort by sub price (desc) and then by final price (asc)
            if filter_params.sort_direction == SortDirection.DESC:
                query = query.order_by(desc(sub_price), final_price)
            else:
                query = query.order_by(sub_price, final_price)

        elif filter_params.sort_by == BookSortField.POPULARITY:
            # Sort by review count (desc) and then by final price (asc)
            if filter_params.sort_direction == SortDirection.DESC:
                query = query.order_by(desc("review_count"), final_price)
            else:
                query = query.order_by("review_count", final_price)

        elif filter_params.sort_by == BookSortField.PRICE:
            # Sort by final price (desc or asc)
            if filter_params.sort_direction == SortDirection.DESC:
                query = query.order_by(desc(final_price))
            else:
                query = query.order_by(final_price)

        total_count = query.count()

        offset = (filter_params.page - 1) * filter_params.size
        query = query.offset(offset).limit(filter_params.size)

        query_result = query.all()

        result = []
        for row in query_result:
            book = row.Book

            author = AuthorService.get_author_by_id(book.author_id, db)
            category = CategoryService.get_category_by_id(book.category_id, db)

            # Get valid discounts for this book
            valid_book_discounts = [
                d for d in book.discounts
                if d.discount_end_date is None or d.discount_end_date > today
            ]

            # Sort discounts by discount amount (biggest discount first)
            if valid_book_discounts:
                valid_book_discounts.sort(key=lambda d: book.book_price - d.discount_price, reverse=True)

            book_dict = book.__dict__.copy()
            avg_rating = round(float(row.avg_rating), 2) if row.avg_rating is not None else 0.0
            rating_dict = {"review_count": row.review_count, "average_rating": avg_rating}
            book_dict["discount"] = valid_book_discounts[0] if valid_book_discounts else None
            book_dict["author"] = author
            book_dict["category"] = category
            book_dict["rating"] = rating_dict

            result.append(BookReadSimpleWithRating.model_validate(book_dict))

        total_pages = (total_count + filter_params.size - 1) // filter_params.size if total_count > 0 else 0

        return PaginatedResponse[BookReadSimpleWithRating](
            data=result,
            meta=PaginationMeta(
                total=total_count,
                page=filter_params.page,
                size=filter_params.size,
                total_pages=total_pages
            )
        )

    @staticmethod
    def get_book_by_id(book_id: int, db: Session) -> Optional[BookRead]:
        book = db.query(Book).filter(Book.id == book_id).first()
        if not book:
            return None

        discount = DiscountService.get_current_discount_for_book(book_id, db)
        author = AuthorService.get_author_by_id(book.author_id, db)
        category = CategoryService.get_category_by_id(book.category_id, db)

        review_count = db.query(func.count(Review.id))\
            .filter(Review.book_id == book_id)\
            .scalar() or 0

        average_rating = ReviewService.get_average_rating_for_book(book_id, db)

        rating_dict = {
            "average_rating": average_rating.average_rating,
            "review_count": review_count
        }

        book_dict = {**book.__dict__}
        book_dict["discount"] = discount
        book_dict["author"] = author
        book_dict["category"] = category
        book_dict["rating"] = rating_dict

        return BookRead.model_validate(book_dict)

    @staticmethod
    def get_recommended_books(db: Session) -> List[BookReadSimpleWithRating]:
        """
        Recommended: get top 8 books with highest average rating, and if multiple books have
        the same rating, sort by lowest final price
        """
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

        # Calculate final price for sorting - use the discount price directly if available
        final_price = case(
            (valid_discounts.c.discount_price.is_(None), Book.book_price),
            else_=valid_discounts.c.discount_price
        ).label("final_price")

        # Get average rating and review count
        avg_rating = func.coalesce(func.round(func.avg(Review.rating_star), 2), 0.0).label("avg_rating")
        review_count = func.count(Review.id).label("review_count")

        query_result = (
            db.query(
                Book,
                avg_rating,
                review_count,
                final_price
            )
            .outerjoin(Review, Book.id == Review.book_id)
            .outerjoin(valid_discounts, Book.id == valid_discounts.c.book_id)
            .options(joinedload(Book.discounts))
            .group_by(Book.id, valid_discounts.c.discount_price, Book.book_price)
            # Sort by highest average rating first, then by lowest final price
            .order_by(desc(avg_rating), final_price)
            .limit(8)
            .all()
        )

        result = []
        for row in query_result:
            book = row.Book
            avg_rating = round(float(row.avg_rating), 2) if row.avg_rating is not None else 0.0
            review_count = row.review_count
            author = AuthorService.get_author_by_id(book.author_id, db)
            category = CategoryService.get_category_by_id(book.category_id, db)

            valid_book_discounts = [
                d for d in book.discounts
                if d.discount_end_date is None or d.discount_end_date > today
            ]
            valid_book_discounts.sort(key=lambda d: book.book_price - d.discount_price, reverse=True)

            book_dict = book.__dict__.copy()
            book_dict["discount"] = valid_book_discounts[0] if valid_book_discounts else None
            book_dict["author"] = author
            book_dict["category"] = category
            rating_dict = {
                "average_rating": avg_rating,
                "review_count": review_count
            }
            book_dict["rating"] = rating_dict
            result.append(BookReadSimpleWithRating.model_validate(book_dict))

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
        
    @staticmethod
    def create_book(book_data: BookCreate, db: Session) -> BookRead:
        book = Book(**book_data.model_dump())
        db.add(book)
        db.commit()
        db.refresh(book)
        return BookRead.model_validate(book)
