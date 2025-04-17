from sqlalchemy.orm import Session
from typing import Tuple, List, Optional
from api.v1.schemas.book import BookRead
from api.v1.schemas.query import BookFilter
from models.book import Book
from api.v1.services.discount import get_current_discount_for_book
from api.v1.services.author import get_author_by_id
from api.v1.services.category import get_category_by_id


def get_books(db: Session, filter_params: BookFilter) -> Tuple[List[BookRead], int]:
    pass


def get_book_by_id(book_id: int, db: Session) -> Optional[BookRead]:
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        return None
    discount = get_current_discount_for_book(book_id, db)
    author = get_author_by_id(book.author_id, db)
    category = get_category_by_id(book.category_id, db)

    book_dict = {**book.__dict__}
    book_dict["discount"] = discount
    book_dict["author"] = author
    book_dict["category"] = category
    return BookRead.model_validate(book_dict)
