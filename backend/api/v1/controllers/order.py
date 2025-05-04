from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from api.v1.schemas.order import OrderClientInput, OrderRead
from api.v1.services.order import OrderService


class OrderController:
    @staticmethod
    def create_order(order_data: OrderClientInput, db: Session, user_id: int) -> OrderRead:
        """
        Create an order with validation of prices against database

        Args:
            order_data: Order data from client
            db: Database session
            user_id: ID of the user placing the order

        Returns:
            Created order

        Raises:
            HTTPException: If there's a price mismatch or book not found
        """
        return OrderService.create_order_from_client_input(order_data, db, user_id)
