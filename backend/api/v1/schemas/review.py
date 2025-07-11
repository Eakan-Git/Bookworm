from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ReviewBase(BaseModel):
    """Base Review schema with shared properties"""
    review_title: str = Field(max_length=120)
    review_details: Optional[str] = None
    rating_star: Optional[int] = Field(default=None, ge=1, le=5)

    class Config:
        orm_mode = True
        from_attributes = True


class ReviewCreate(ReviewBase):
    """Schema for creating a new review"""
    pass


class ReviewRead(ReviewBase):
    """Schema for reading a review"""
    id: int
    book_id: int
    review_date: Optional[datetime] = None

    class Config:
        orm_mode = True
        from_attributes = True


class AverageRating(BaseModel):
    """Schema for average rating"""
    review_count: Optional[int] = None
    average_rating: float


class ReviewUpdate(ReviewBase):
    pass
