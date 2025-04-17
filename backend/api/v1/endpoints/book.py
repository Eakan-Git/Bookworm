from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from api.v1.schemas.common import PaginatedResponse
from api.v1.schemas.book import BookRead
from api.v1.schemas.query import BookFilter
from api.v1.controllers.book import BookController
from api.v1.dependencies.dependencies import get_db_session

router = APIRouter(prefix="/books")


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
    # Use the controller to handle business logic
    return BookController.get_book_by_id(book_id, db)


@router.get("",
            response_model=PaginatedResponse[BookRead],
            status_code=status.HTTP_200_OK,
            summary="Get paginated list of books",
            description="Retrieve books with their authors and categories, with filtering and sorting options.")
def list_books(
    filter_params: BookFilter = Depends(),
    db: Session = Depends(get_db_session)
):
    """Get a filtered and paginated list of books with their nested relationships.

    This endpoint returns books with their full author and category details,
    avoiding the need for additional API calls (roundtrips).

    You can filter books by various criteria including:
    - Text search (searches in title and summary)
    - Category ID
    - Author ID
    - Price range (min and max)

    You can also sort results by:
    - Title
    - Price
    - Author name
    - Category name

    If no books are found for the requested page, a 404 error is returned.
    """
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
    )
    # Use the controller to handle business logic
    # return BookController.get_books_paginated(filter_params, db)
