from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReviewBase(BaseModel):
    """Base Review schema with shared properties"""
    review_title: str
    review_details: Optional[str] = None
    rating_star: Optional[int] = None
    
    class Config:
        orm_mode = True
        from_attributes = True


class ReviewCreate(ReviewBase):
    """Schema for creating a new review"""
    book_id: int


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
    average_rating: float

class ReviewUpdate(ReviewBase):
    pass