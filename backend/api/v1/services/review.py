from sqlalchemy.orm import Session
from api.v1.schemas.review import AverageRating, ReviewCreate, ReviewRead
from models.review import Review
from sqlalchemy.sql import func
from fastapi.logger import logger


class ReviewService:
    @staticmethod
    def get_average_rating_for_book(book_id: int, db: Session) -> AverageRating:
        avg_rating = db.query(func.round(func.avg(Review.rating_star), 2))\
            .filter(Review.book_id == book_id)\
            .scalar()

        return AverageRating(average_rating=float(avg_rating or 0))

    @staticmethod
    def post_review_for_book(review_data: ReviewCreate, db: Session) -> ReviewRead:
        review = Review(**review_data.model_dump())
        logger.info(f"Creating review for book {review_data.book_id}")
        logger.info(f"Review data: {review_data}")
        logger.info(f"Review object: {review}")
        db.add(review)
        db.commit()
        db.refresh(review)
        return ReviewRead.model_validate(review)
