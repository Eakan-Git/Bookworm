from pydantic import BaseModel
from typing import Optional


class Author(BaseModel):
    author_name: str
    author_bio: Optional[str] = None

    class Config:
        from_attributes = True
        orm_mode = True


class AuthorCreate(Author):
    pass


class AuthorRead(Author):
    id: int
    class Config:
        from_attributes = True
        orm_mode = True


class AuthorUpdate(Author):
    pass
