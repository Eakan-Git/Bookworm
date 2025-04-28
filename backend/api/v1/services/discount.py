from sqlalchemy.orm import Session
from typing import Optional
from models.discount import Discount
from api.v1.schemas.discount import DiscountRead
from datetime import date
from sqlalchemy import or_


class DiscountService:
    @staticmethod
    def get_current_discount_for_book(book_id: int, db: Session) -> Optional[DiscountRead]:
        discount = (
            db.query(Discount)
            .filter(
                Discount.book_id == book_id,
                or_(
                    Discount.discount_end_date == None,
                    Discount.discount_end_date > date.today()
                )
            )
            .first()
        )
        if not discount:
            return None
        return DiscountRead.model_validate(discount)
