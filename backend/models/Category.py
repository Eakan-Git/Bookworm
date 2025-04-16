from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from .book import Book

class Category(SQLModel, table=True):
    __tablename__ = "category"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    category_name: str = Field(max_length=120)
    category_desc: str = Field(max_length=255)
    
    # Relationships
    books: List["Book"] = Relationship(back_populates="category")
