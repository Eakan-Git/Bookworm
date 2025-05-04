from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from api.v1.schemas.order import OrderRead, OrderClientInput
from api.v1.controllers.order import OrderController
from api.v1.dependencies.dependencies import get_db_session
from api.v1.middlewares.auth_middleware import get_current_user
from models.user import User

router = APIRouter(prefix="/orders")


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(
    order_data: OrderClientInput,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new order

    This endpoint:
    - Requires authentication
    - Validates that all books exist
    - Validates that client prices match database prices
    - Creates the order with the validated data

    Args:
        order_data: Order data from client with book_id, quantity, and price
        db: Database session
        current_user: Authenticated user

    Returns:
        Created order

    Raises:
        HTTPException:
            - 400 Bad Request if there's a price mismatch
            - 404 Not Found if a book doesn't exist
    """
    # Validate order has items
    if not order_data.order_items or len(order_data.order_items) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item"
        )

    return OrderController.create_order(order_data, db, current_user.id)
