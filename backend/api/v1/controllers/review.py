from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from api.v1.schemas.review import ReviewCreate, ReviewRead
from api.v1.services.review import ReviewService
from api.v1.services.book import BookService


class ReviewController:
    @staticmethod
    def post_review_for_book(book_id: int, review_data: ReviewCreate, db: Session) -> ReviewRead:
        book = BookService.get_book_by_id(book_id, db)
        if not book:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Book not found with id {book_id}"
            )
        return ReviewService.post_review_for_book(book.id, review_data, db)
