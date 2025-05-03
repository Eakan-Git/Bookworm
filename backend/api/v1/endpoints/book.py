from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from api.v1.schemas.common import PaginatedResponse
from api.v1.schemas.review import ReviewRead, ReviewCreate
from api.v1.schemas.book import BookRead, BookReadSimple, BookReadSimpleWithReviewCount, BookReadSimpleWithRating
from api.v1.schemas.query import BookFilter, ReviewFilter
from api.v1.controllers.book import BookController
from api.v1.controllers.review import ReviewController
from api.v1.dependencies.dependencies import get_db_session

router = APIRouter(prefix="/books")


@router.get("/on-sale",
            response_model=List[BookReadSimple],
            status_code=status.HTTP_200_OK,
            summary="Get list of books on sale",
            description="Retrieve books with biggest discounts.")
def get_on_sale_books(db: Session = Depends(get_db_session)):
    return BookController.get_on_sale_books(db)


@router.get("/popular",
            response_model=List[BookReadSimpleWithReviewCount],
            status_code=status.HTTP_200_OK,
            summary="Get list of popular books",
            description="Retrieve books with most reviews.")
def get_popular_books(db: Session = Depends(get_db_session)):
    return BookController.get_popular_books(db)


@router.get("/{book_id}",
            response_model=BookRead,
            status_code=status.HTTP_200_OK,
            summary="Get a book by ID",
            description="Retrieve a book with its full author and category details.")
def get_book(
    book_id: int,
    db: Session = Depends(get_db_session)
):
    """Get a book by ID with its full author and category details."""
    return BookController.get_book_by_id(book_id, db)


@router.get("",
            response_model=PaginatedResponse[BookReadSimpleWithRating],
            status_code=status.HTTP_200_OK,
            summary="Get paginated list of books",
            description="Retrieve books with their authors and categories, with filtering and sorting options.")
def list_books(
    filter_params: BookFilter = Depends(),
    db: Session = Depends(get_db_session)
):
    return BookController.get_books_paginated(filter_params, db)


@router.get("/{book_id}/reviews",
            response_model=PaginatedResponse[ReviewRead],
            status_code=status.HTTP_200_OK,
            summary="Get list of reviews for a book",
            description="Retrieve reviews for a specific book.")
def get_reviews_for_book(
    book_id: int,
    filter_params: ReviewFilter = Depends(),
    db: Session = Depends(get_db_session)
):
    """Get a filtered and paginated list of reviews for a specific book.

    This endpoint returns reviews for a specific book, with filtering and sorting options.
    """
    return BookController.get_reviews_by_book_id(book_id, filter_params, db)


@router.post("/{book_id}/reviews",
             response_model=ReviewRead,
             status_code=status.HTTP_201_CREATED,
             summary="Create a new review for a book",
             description="Create a new review for a specific book.")
def create_review_for_book(
    book_id: int,
    review_data: ReviewCreate,
    db: Session = Depends(get_db_session)
):
    """Create a new review for a specific book.

    This endpoint creates a new review for a specific book.
    """
    return ReviewController.post_review_for_book(book_id, review_data, db)
