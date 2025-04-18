from pydantic import BaseModel
from typing import Optional


class Category(BaseModel):
    category_name: str
    category_desc: Optional[str] = None

    class Config:
        from_attributes = True
        orm_mode = True


class CategoryCreate(Category):
    pass


class CategoryRead(Category):
    id: int
    class Config:
        from_attributes = True
        orm_mode = True


class CategoryUpdate(Category):
    pass
