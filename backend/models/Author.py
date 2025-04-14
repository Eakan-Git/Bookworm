from sqlmodel import SQLModel, Field
from typing import Optional

class Author(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True, sa_column_kwargs={"autoincrement": True, "type_": "BIGINT"})
    author_name: str = Field(max_length=255)
    author_bio: Optional[str] = Field(default=None)