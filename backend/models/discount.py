from sqlmodel import SQLModel, Field, Relationship, Column, Numeric
from typing import Optional, TYPE_CHECKING
from decimal import Decimal
from datetime import date

if TYPE_CHECKING:
    from .book import Book


class Discount(SQLModel, table=True):
    __tablename__ = "discount"

    id: Optional[int] = Field(default=None, primary_key=True)
    book_id: Optional[int] = Field(default=None, foreign_key="book.id")
    discount_start_date: Optional[date] = Field(default=None)
    discount_end_date: Optional[date] = Field(default=None)
    discount_price: Optional[Decimal] = Field(
        default=None,
        sa_column=Column(Numeric(5, 2))
    )

    # Relationships
    book: Optional["Book"] = Relationship(back_populates="discounts")
