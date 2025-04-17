from sqlalchemy.orm import Session
from typing import List, Optional
from api.v1.schemas.category import CategoryRead
from models.category import Category


class CategoryService:
    @staticmethod
    def get_categories(db: Session) -> List[CategoryRead]:
        categories = db.query(Category).order_by(Category.category_name.asc()).all()
        return [CategoryRead.model_validate(cat) for cat in categories]

    @staticmethod
    def get_category_by_id(category_id: int, db: Session) -> Optional[CategoryRead]:
        category = db.query(Category).filter(Category.id == category_id).first()
        if category:
            return CategoryRead.model_validate(category)
        return None
