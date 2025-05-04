from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


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


class SimplifiedDiscount(BaseModel):
    """Simplified discount schema with string dates for JSON serialization"""
    discount_start_date: Optional[str] = None
    discount_end_date: Optional[str] = None
    discount_price: Optional[float] = None
    id: int
    book_id: int


class SimplifiedAuthor(BaseModel):
    """Simplified author schema for JSON serialization"""
    author_name: str
    author_bio: Optional[str] = None
    id: int


class SimplifiedCategory(BaseModel):
    """Simplified category schema for JSON serialization"""
    category_name: str
    category_desc: Optional[str] = None
    id: int


class MismatchedBook(BaseModel):
    """Book with price mismatch information for JSON serialization"""
    id: int
    book_title: str
    book_summary: Optional[str] = None
    book_price: Optional[float] = None
    book_cover_photo: Optional[str] = None
    category: Optional[SimplifiedCategory] = None
    author: Optional[SimplifiedAuthor] = None
    discount: Optional[SimplifiedDiscount] = None
    # Price mismatch information
    expected_price: float
    actual_price: float


class PriceMismatchError(BaseModel):
    """Schema for price mismatch error"""
    mismatches: List[MismatchedBook]