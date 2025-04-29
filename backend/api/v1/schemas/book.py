from pydantic import BaseModel
from .author import AuthorRead
from .category import CategoryRead
from .discount import DiscountRead
from .review import AverageRating
from typing import Optional


class BookBase(BaseModel):
    """Base Book schema with shared properties"""
    book_title: str
    book_summary: Optional[str] = None
    book_price: Optional[float] = None
    book_cover_photo: Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True


class BookCreate(BookBase):
    """Schema for creating a new book"""
    category_id: Optional[int] = None
    author_id: Optional[int] = None


class BookRead(BookBase):
    """Schema for reading a book with all details including relationships"""
    id: int
    category: Optional[CategoryRead] = None
    author: Optional[AuthorRead] = None
    discount: Optional[DiscountRead] = None
    rating: Optional[AverageRating] = None

    class Config:
        orm_mode = True
        from_attributes = True


class BookReadSimple(BookBase):
    """Schema for reading a book with only basic details"""
    id: int
    category: Optional[CategoryRead] = None
    author: Optional[AuthorRead] = None
    discount: Optional[DiscountRead] = None

    class Config:
        orm_mode = True
        from_attributes = True
        
class BookReadSimpleWithReviewCount(BookReadSimple):
    review_count: int


class BookUpdate(BookBase):
    """Schema for updating a book"""
    book_title: Optional[str] = None
    category_id: Optional[int] = None
    author_id: Optional[int] = None
