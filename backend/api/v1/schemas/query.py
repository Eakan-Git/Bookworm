from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field

class PaginationParams(BaseModel):
    """Base pagination parameters for query parameters"""
    page: int = Field(1, ge=1, description="Page number, starting from 1")
    size: int = Field(10, ge=1, le=100, description="Number of items per page")

class SortDirection(str, Enum):
    """Sort direction enum for query parameters"""
    ASC = "asc"
    DESC = "desc"


class BookSortField(str, Enum):
    """Fields that can be used for sorting books"""
    ON_SALE = "on_sale"  # Sort by discount amount (price - discounted price)
    POPULARITY = "popularity"  # Sort by number of reviews
    PRICE = "price"  # Sort by final price

class ReviewSortField(str, Enum):
    """Fields that can be used for sorting reviews"""
    DATE = "date"  # Sort by review date

class BookFilter(PaginationParams):
    """Base filter model for book queries"""
    category_id: Optional[int] = Field(None, description="Filter by category ID")
    author_id: Optional[int] = Field(None, description="Filter by author ID")
    rating_star: Optional[int] = Field(None, ge=1, le=5, description="Filter books with average rating equal or greater than this value (1-5)")
    
    # Sorting options
    sort_by: Optional[BookSortField] = Field(BookSortField.ON_SALE, description="Field to sort by: on_sale, popularity, or price")
    sort_direction: Optional[SortDirection] = Field(SortDirection.DESC, description="Sort direction: asc or desc")
    
    class Config:
        """Pydantic config"""
        use_enum_values = True

class ReviewFilter(PaginationParams):
    """Base filter model for review queries"""
    rating_star: Optional[int] = Field(None, ge=1, le=5, description="Filter reviews with rating equal to this value (1-5)")
    
    # Sorting options
    sort_by: Optional[ReviewSortField] = Field(ReviewSortField.DATE, description="Field to sort by: date")
    sort_direction: Optional[SortDirection] = Field(SortDirection.DESC, description="Sort direction: desc (newest first) or asc (oldest first)")
    
    class Config:
        """Pydantic config"""
        use_enum_values = True
