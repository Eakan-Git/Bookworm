from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from api.v1.services.category import get_categories, get_category_by_id
from api.v1.schemas.category import CategoryRead
from typing import List

class CategoryController:
    @staticmethod
    def get_categories(db: Session) -> List[CategoryRead]:
        return get_categories(db)

    @staticmethod
    def get_category_by_id(category_id: int, db: Session) -> CategoryRead:
        category = get_category_by_id(category_id, db)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Category not found with id {category_id}"
            )
        return category
