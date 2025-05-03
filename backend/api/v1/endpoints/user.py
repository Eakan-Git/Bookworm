from fastapi import APIRouter, HTTPException, Depends, status

from models.user import User
from api.v1.middlewares.auth_middleware import get_current_user, get_current_admin_user


router = APIRouter()

@router.get("/users/me", summary="Get current user information")
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get information about the currently authenticated user

    This endpoint requires authentication
    """
    return {
        "id": current_user.id,
        "email": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "admin": current_user.admin
    }


@router.get("/users/admin", summary="Admin only endpoint")
async def admin_only(
    current_user: User = Depends(get_current_admin_user)
):
    """
    Admin only endpoint

    This endpoint requires authentication and admin privileges
    """
    return {
        "message": "You have admin access",
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "admin": current_user.admin
        }
    }
