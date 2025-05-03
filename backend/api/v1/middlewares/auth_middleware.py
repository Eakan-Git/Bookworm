from fastapi import Depends, HTTPException, status, Cookie
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import Session
from typing import Optional
import os
from dotenv import load_dotenv

from api.v1.schemas.token import AccessTokenPayload
from api.v1.services.user import UserService
from models.user import User
from api.v1.dependencies.dependencies import get_db_session

# Load environment variables
load_dotenv()

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    access_token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db_session)
) -> User:
    """
    Get the current user from the access token

    Args:
        access_token: JWT access token
        db: Database session

    Returns:
        User object

    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decode the JWT token
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])

        # Extract user email from token
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception

        # Create token payload object
        token_data = AccessTokenPayload(**payload)
    except JWTError:
        raise credentials_exception

    # Get user from database
    user = UserService.get_by_email(db, email)
    if user is None:
        raise credentials_exception

    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get the current active user

    Args:
        current_user: User object from get_current_user

    Returns:
        User object

    Raises:
        HTTPException: If user is inactive
    """
    # You can add additional checks here, like if the user is active
    return current_user


async def get_current_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get the current admin user

    Args:
        current_user: User object from get_current_user

    Returns:
        User object

    Raises:
        HTTPException: If user is not an admin
    """
    if not current_user.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return current_user


async def get_token_from_cookie(
    access_token: Optional[str] = Cookie(None, alias="access_token")
) -> str:
    """
    Get the access token from cookie

    Args:
        access_token: Access token from cookie

    Returns:
        Access token

    Raises:
        HTTPException: If token is not found
    """
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return access_token

# Alternative dependency that checks for token in both cookie and Authorization header


async def get_token(
    token_from_cookie: Optional[str] = Depends(get_token_from_cookie),
    token_from_header: Optional[str] = Depends(oauth2_scheme)
) -> str:
    """
    Get the access token from either cookie or header

    Args:
        token_from_cookie: Access token from cookie
        token_from_header: Access token from header

    Returns:
        Access token

    Raises:
        HTTPException: If token is not found
    """
    # Prefer header token over cookie
    if token_from_header:
        return token_from_header
    if token_from_cookie:
        return token_from_cookie

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
        headers={"WWW-Authenticate": "Bearer"},
    )

# Dependency to get current user from either cookie or header token


async def get_current_user_from_token_or_cookie(
    token: str = Depends(get_token),
    db: Session = Depends(get_db_session)
) -> User:
    """
    Get the current user from either cookie or header token

    Args:
        token: Access token
        db: Database session

    Returns:
        User object

    Raises:
        HTTPException: If token is invalid or user not found
    """
    return await get_current_user(token, db)
