from sqlmodel import SQLModel, Field, Relationship, Column, Numeric
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from decimal import Decimal

if TYPE_CHECKING:
    from .user import User
    from .order_item import OrderItem


class Order(SQLModel, table=True):
    __tablename__ = "order"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    order_date: datetime = Field(default_factory=datetime.utcnow)
    order_amount: Optional[Decimal] = Field(
        default=None,
        sa_column=Column(Numeric(8, 2))
    )

    # Relationships
    user: Optional["User"] = Relationship(back_populates="orders")
    order_items: List["OrderItem"] = Relationship(back_populates="order")
