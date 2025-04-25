from sqlalchemy.orm import Session
from api.v1.schemas.review import ReviewCreate, ReviewRead
from api.v1.services.review import ReviewService

class ReviewController:
    @staticmethod
    def post_review_for_book(review_data: ReviewCreate, db: Session) -> ReviewRead:
        return ReviewService.post_review_for_book(review_data, db)
