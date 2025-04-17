from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from api.v1.schemas.common import PaginatedResponse, PaginationMeta
from api.v1.schemas.book import BookRead
from api.v1.schemas.query import BookFilter
from api.v1.services.book import get_books, get_book_by_id


class BookController:
    @staticmethod
    def get_books_paginated(filter_params: BookFilter, db: Session) -> PaginatedResponse[BookRead]:
        books, total = get_books(db, filter_params)

        if not books and filter_params.page > 1:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No books found for page {filter_params.page}"
            )

        return PaginatedResponse[BookRead](
            data=books,
            meta=PaginationMeta(
                total=total,
                page=filter_params.page,
                size=filter_params.size
            )
        )

    @staticmethod
    def get_book_by_id(book_id: int, db: Session) -> BookRead:
        book = get_book_by_id(book_id, db)

        if not book:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Book not found with id {book_id}"
            )

        return book
