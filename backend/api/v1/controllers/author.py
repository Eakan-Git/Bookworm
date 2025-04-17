from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from api.v1.services.author import get_authors, get_author_by_id
from api.v1.schemas.author import AuthorRead
from typing import List

class AuthorController:
    @staticmethod
    def get_authors(db: Session) -> List[AuthorRead]:
        return get_authors(db)

    @staticmethod
    def get_author_by_id(author_id: int, db: Session) -> AuthorRead:
        author = get_author_by_id(author_id, db)
        if not author:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Author not found with id {author_id}"
            )
        return author
