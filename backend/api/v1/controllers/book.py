from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List
from api.v1.schemas.common import PaginatedResponse
from api.v1.schemas.book import BookRead, BookReadSimpleWithReviewCount, BookReadSimpleWithRating
from api.v1.schemas.query import BookFilter, ReviewFilter
from api.v1.schemas.review import ReviewRead
from api.v1.services.book import BookService


class BookController:
    @staticmethod
    def get_books_paginated(filter_params: BookFilter, db: Session) -> PaginatedResponse[BookReadSimpleWithRating]:
        result = BookService.get_books(db, filter_params)

        if not result.data and filter_params.page > 1:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No books found for page {filter_params.page}"
            )

        return result

    @staticmethod
    def get_book_by_id(book_id: int, db: Session) -> BookRead:
        book = BookService.get_book_by_id(book_id, db)
        if not book:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Book not found with id {book_id}"
            )
        return book

    @staticmethod
    def get_on_sale_books(db: Session) -> List[BookRead]:
        return BookService.get_on_sale_books(db)

    @staticmethod
    def get_popular_books(db: Session) -> List[BookReadSimpleWithReviewCount]:
        return BookService.get_popular_books(db)

    @staticmethod
    def get_reviews_by_book_id(book_id: int, filter_params: ReviewFilter, db: Session) -> PaginatedResponse[ReviewRead]:
        book = BookService.get_book_by_id(book_id, db)
        if not book:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Book not found with id {book_id}"
            )
        return BookService.get_reviews_by_book_id(book_id, filter_params, db)
