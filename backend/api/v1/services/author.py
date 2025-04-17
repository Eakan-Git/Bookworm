from sqlalchemy.orm import Session
from typing import List, Optional
from api.v1.schemas.author import AuthorRead
from models.author import Author


class AuthorService:
    @staticmethod
    def get_authors(db: Session) -> List[AuthorRead]:
        authors = db.query(Author).order_by(Author.author_name.asc()).all()
        return [AuthorRead.model_validate(author) for author in authors]

    @staticmethod
    def get_author_by_id(author_id: int, db: Session) -> Optional[AuthorRead]:
        author = db.query(Author).filter(Author.id == author_id).first()
        if author:
            return AuthorRead.model_validate(author)
        return None
