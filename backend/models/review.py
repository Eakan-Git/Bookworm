from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime, timezone

if TYPE_CHECKING:
    from .book import Book


class Review(SQLModel, table=True):
    __tablename__ = "review"

    id: Optional[int] = Field(default=None, primary_key=True)
    book_id: Optional[int] = Field(default=None, foreign_key="book.id")
    review_title: str = Field(max_length=120)
    review_details: Optional[str] = Field(default=None)
    review_date: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    rating_star: Optional[int] = Field(default=None, ge=1, le=5)

    # Relationships
    book: Optional["Book"] = Relationship(back_populates="reviews")
