from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class SortDirection(str, Enum):
    """Sort direction enum for query parameters"""
    ASC = "asc"
    DESC = "desc"


class BookSortField(str, Enum):
    """Fields that can be used for sorting books"""
    ON_SALE = "on_sale"  # Sort by discount amount (price - discounted price)
    POPULARITY = "popularity"  # Sort by number of reviews
    PRICE = "price"  # Sort by final price


class BookFilter(BaseModel):
    """Base filter model for book queries"""
    page: int = Field(1, ge=1, description="Page number, starting from 1")
    size: int = Field(10, ge=1, le=100, description="Number of items per page")
    
    # Optional filters
    search: Optional[str] = Field(None, description="Search term for book title or summary")
    category_id: Optional[int] = Field(None, description="Filter by category ID")
    author_id: Optional[int] = Field(None, description="Filter by author ID")
    rating_star: Optional[int] = Field(None, ge=1, le=5, description="Filter books with average rating equal or greater than this value (1-5)")
    
    # Sorting options
    sort_by: Optional[BookSortField] = Field(BookSortField.ON_SALE, description="Field to sort by: on_sale, popularity, or price")
    sort_direction: Optional[SortDirection] = Field(SortDirection.DESC, description="Sort direction: asc or desc")
    
    class Config:
        """Pydantic config"""
        use_enum_values = True
