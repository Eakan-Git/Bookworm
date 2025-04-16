from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from .book import Book

class Author(SQLModel, table=True):
    __tablename__ = "author"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    author_name: str = Field(max_length=255)
    author_bio: Optional[str] = Field(default=None)
    
    # Relationships
    books: List["Book"] = Relationship(back_populates="author")
