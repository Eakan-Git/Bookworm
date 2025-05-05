from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from api.v1.schemas.book import BookReadSimple

class OrderItemClientInput(BaseModel):
    """Schema for client input when creating an order item"""
    book_id: int
    quantity: int = Field(gt=0, le=8)
    price: float  # Client's expected price


class OrderItemBase(BaseModel):
    """Base OrderItem schema with shared properties"""
    book_id: int
    quantity: int
    price: Decimal

    class Config:
        orm_mode = True
        from_attributes = True


class OrderItemCreate(OrderItemBase):
    """Schema for creating a new order item (internal use)"""
    pass


class OrderItemRead(OrderItemBase):
    """Schema for reading an order item"""
    id: int
    order_id: int

    class Config:
        orm_mode = True
        from_attributes = True


class OrderBase(BaseModel):
    """Base Order schema with shared properties"""
    order_date: Optional[datetime] = None
    order_amount: Optional[Decimal] = None

    class Config:
        orm_mode = True
        from_attributes = True


class OrderClientInput(BaseModel):
    """Schema for client input when creating an order"""
    order_items: List[OrderItemClientInput]


class OrderCreate(OrderBase):
    """Schema for creating a new order (internal use)"""
    order_items: List[OrderItemCreate]


class OrderRead(OrderBase):
    """Schema for reading an order"""
    id: int
    user_id: int
    order_items: List[OrderItemRead]

    class Config:
        orm_mode = True
        from_attributes = True


class OrderError(BaseModel):
    mismatches: List[BookReadSimple]
    not_found: List[int]