from sqlmodel import SQLModel, Field, Relationship, Column, Numeric
from typing import Optional, TYPE_CHECKING
from decimal import Decimal

if TYPE_CHECKING:
    from .order import Order
    from .book import Book


class OrderItem(SQLModel, table=True):
    __tablename__ = "order_item"

    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: Optional[int] = Field(default=None, foreign_key="order.id")
    book_id: Optional[int] = Field(default=None, foreign_key="book.id")
    quantity: int = Field(default=1, gt=0, le=8)
    price: Optional[Decimal] = Field(
        default=None,
        sa_column=Column(Numeric(5, 2))
    )

    # Relationships
    order: Optional["Order"] = Relationship(back_populates="order_items")
    book: Optional["Book"] = Relationship(back_populates="order_items")
