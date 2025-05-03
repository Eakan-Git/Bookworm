from fastapi import APIRouter, Depends, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from api.v1.controllers.auth import AuthController
from api.v1.schemas.token import TokenResponse
from api.v1.dependencies.dependencies import get_db_session

router = APIRouter(prefix="/auth")

@router.post("/login", response_model=TokenResponse)
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db_session)
):
    """
    Login endpoint to authenticate users and issue tokens

    Args:
        response: FastAPI response object for setting cookies
        form_data: Form with username (email) and password
        db: Database session

    Returns:
        TokenResponse with access and refresh tokens
    """
    return AuthController.login(response, form_data, db)

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    response: Response,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """
    Refresh token endpoint to issue new tokens

    Args:
        response: FastAPI response object for setting cookies
        request: FastAPI request object for getting cookies/body
        db: Database session

    Returns:
        TokenResponse with new access and refresh tokens
    """
    return await AuthController.refresh_token(response, request, db)

@router.post("/logout")
async def logout(
    response: Response,
    request: Request,
    db: Session = Depends(get_db_session)
):
    """
    Logout endpoint to clear cookies and revoke refresh token

    Args:
        response: FastAPI response object for clearing cookies
        request: FastAPI request object for getting cookies/body
        db: Database session

    Returns:
        Success message
    """
    return await AuthController.logout(response, request, db)