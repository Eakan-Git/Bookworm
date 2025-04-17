from sqlmodel import SQLModel, Field, Relationship, Column, Numeric, Session, select
from typing import Optional, TYPE_CHECKING, List
from decimal import Decimal
from datetime import date
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import validates

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
    
    @validates('discount_start_date', 'discount_end_date')
    def validate_dates(self, key, value):
        """Validate that discount dates make sense and don't overlap with existing discounts"""
        if key == 'discount_end_date' and value and self.discount_start_date:
            # Ensure end date is after start date
            if value < self.discount_start_date:
                raise ValueError("Discount end date must be after start date")
        
        return value
    
    @classmethod
    def check_overlapping_discounts(cls, session: Session, book_id: int, 
                                   start_date: date, end_date: date, 
                                   discount_id: Optional[int] = None) -> bool:
        """Check if there are any overlapping discounts for the same book.
        
        Args:
            session: Database session
            book_id: ID of the book to check
            start_date: New discount start date
            end_date: New discount end date
            discount_id: ID of current discount (to exclude when updating)
            
        Returns:
            True if there are overlapping discounts, False otherwise
        """
        query = select(cls).where(
            cls.book_id == book_id,
            # Check for date range overlap
            cls.discount_start_date <= end_date,
            cls.discount_end_date >= start_date
        )
        
        # If updating an existing discount, exclude it from the check
        if discount_id is not None:
            query = query.where(cls.id != discount_id)
            
        # Check if any overlapping discounts exist
        result = session.exec(query).first()
        return result is not None
