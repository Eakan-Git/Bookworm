from pydantic import BaseModel, field_serializer
from typing import Optional
from datetime import date


class DiscountBase(BaseModel):
    """Base Discount schema with shared properties"""
    discount_start_date: Optional[date] = None
    discount_end_date: Optional[date] = None
    discount_price: Optional[float] = None

    @field_serializer('discount_start_date', 'discount_end_date')
    def serialize_date(self, value: Optional[date]) -> Optional[str]:
        """Serialize date objects to ISO format strings for JSON serialization"""
        if value is None:
            return None
        return value.isoformat()

    class Config:
        orm_mode = True
        from_attributes = True


class DiscountCreate(DiscountBase):
    """Schema for creating a new discount"""
    book_id: int


class DiscountRead(DiscountBase):
    """Schema for reading a discount"""
    id: int
    book_id: int

    class Config:
        orm_mode = True
        from_attributes = True


class DiscountUpdate(DiscountBase):
    """Schema for updating a discount"""
    discount_start_date: Optional[date] = None
    discount_end_date: Optional[date] = None
    discount_price: Optional[float] = None
