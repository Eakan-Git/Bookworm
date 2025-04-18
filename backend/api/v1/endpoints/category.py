from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from api.v1.schemas.category import CategoryRead
from api.v1.controllers.category import CategoryController
from api.v1.dependencies.dependencies import get_db_session

router = APIRouter(prefix="/categories")


@router.get("/{category_id}", response_model=CategoryRead, status_code=status.HTTP_200_OK)
def get_category_by_id(category_id: int, db: Session = Depends(get_db_session)):
    return CategoryController.get_category_by_id(category_id, db)


@router.get("", response_model=List[CategoryRead], status_code=status.HTTP_200_OK)
def get_categories(db: Session = Depends(get_db_session)):
    return CategoryController.get_categories(db)
