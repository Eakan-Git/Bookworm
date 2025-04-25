from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from api.v1.schemas.review import ReviewRead, ReviewCreate
from api.v1.controllers.review import ReviewController
from api.v1.dependencies.dependencies import get_db_session

router = APIRouter(prefix="/reviews")


@router.post("/", response_model=ReviewRead, status_code=status.HTTP_201_CREATED)
def post_review_for_book(review_data: ReviewCreate, db: Session = Depends(get_db_session)):
    return ReviewController.post_review_for_book(review_data, db)
