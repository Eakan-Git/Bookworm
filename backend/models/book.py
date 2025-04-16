from sqlmodel import SQLModel, Field, Relationship, Column, Numeric
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from .category import Category
    from .author import Author
    from .review import Review
    from .discount import Discount
    from .order_item import OrderItem


class Book(SQLModel, table=True):
    __tablename__ = "book"

    id: Optional[int] = Field(default=None, primary_key=True)
    category_id: Optional[int] = Field(default=None, foreign_key="category.id")
    author_id: Optional[int] = Field(default=None, foreign_key="author.id")

    book_title: str = Field(max_length=255)
    book_summary: Optional[str] = Field(default=None)
    book_price: Optional[float] = Field(
        default=None,
        sa_column=Column(Numeric(5, 2))
    )
    book_cover_photo: Optional[str] = Field(default=None, max_length=255)

    # Relationships
    category: Optional["Category"] = Relationship(back_populates="books")
    author: Optional["Author"] = Relationship(back_populates="books")
    reviews: List["Review"] = Relationship(back_populates="book")
    discounts: List["Discount"] = Relationship(back_populates="book")
    order_items: List["OrderItem"] = Relationship(back_populates="book")
