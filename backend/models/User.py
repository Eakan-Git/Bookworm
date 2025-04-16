from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from .order import Order

class User(SQLModel, table=True):
    __tablename__ = "user"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    first_name: str = Field(max_length=50)
    last_name: str = Field(max_length=50)
    email: str = Field(max_length=70, unique=True, index=True)
    password: str = Field(max_length=255)  # Should be hashed in reality
    admin: bool = Field(default=False)
    
    # Relationships
    orders: List["Order"] = Relationship(back_populates="user")
