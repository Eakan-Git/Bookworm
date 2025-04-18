from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from api.v1.schemas.author import AuthorRead
from api.v1.controllers.author import AuthorController
from api.v1.dependencies.dependencies import get_db_session

router = APIRouter(prefix="/authors")


@router.get("/{author_id}", response_model=AuthorRead, status_code=status.HTTP_200_OK)
def get_author_by_id(author_id: int, db: Session = Depends(get_db_session)):
    return AuthorController.get_author_by_id(author_id, db)


@router.get("", response_model=List[AuthorRead], status_code=status.HTTP_200_OK)
def get_authors(db: Session = Depends(get_db_session)):
    return AuthorController.get_authors(db)
