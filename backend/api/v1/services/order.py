from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from decimal import Decimal
from typing import List

from api.v1.schemas.order import (
    OrderCreate,
    OrderRead,
    OrderClientInput,
    OrderItemCreate,
    PriceMismatchError
)
from api.v1.schemas.book import BookReadSimple
from models.order import Order
from models.order_item import OrderItem
from api.v1.services.book import BookService


class OrderService:
    @staticmethod
    def create_order_from_client_input(
        client_order_data: OrderClientInput,
        db: Session,
        user_id: int
    ) -> OrderRead:
        """
        Create an order from client input, validating prices against database values.

        Args:
            client_order_data: Order data from client
            db: Database session
            user_id: ID of the user placing the order

        Returns:
            Created order

        Raises:
            HTTPException: If there's a price mismatch or book not found
        """
        validated_items: List[OrderItemCreate] = []
        mismatched_books: List[BookReadSimple] = []
        total_amount = Decimal('0.00')

        for item in client_order_data.order_items:
            # Get book from database
            book = BookService.get_book_by_id(item.book_id, db)
            if not book:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Book not found with id {item.book_id}"
                )

            # Calculate actual price
            actual_price = book.book_price
            if book.discount and book.discount.discount_price:
                actual_price = book.discount.discount_price

            actual_price_float = float(round(actual_price, 2))
            client_price_float = round(item.price, 2)

            # Check for price mismatch
            if client_price_float != actual_price_float:
                # Convert the book to BookReadSimple
                book_data = BookReadSimple.model_validate(book)
                mismatched_books.append(book_data)
            else:
                validated_item = OrderItemCreate(
                    book_id=item.book_id,
                    quantity=item.quantity,
                    price=Decimal(str(actual_price_float))
                )
                validated_items.append(validated_item)
                total_amount += Decimal(str(actual_price_float)) * item.quantity

        # Return mismatch error if needed
        if mismatched_books:
            error_response = PriceMismatchError(
                mismatches=mismatched_books
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_response.model_dump()
            )

        # Create order
        order_data = OrderCreate(
            order_date=None,
            order_amount=total_amount,
            order_items=validated_items
        )
        return OrderService.create_order(order_data, db, user_id)

    @staticmethod
    def create_order(order_data: OrderCreate, db: Session, user_id: int) -> OrderRead:
        """
        Internal method to create an order with pre-validated data.

        Args:
            order_data: Validated order data
            db: Database session
            user_id: ID of the user placing the order

        Returns:
            Created order
        """
        order = Order(
            user_id=user_id,
            order_amount=order_data.order_amount
        )
        db.add(order)
        db.flush()

        for item_data in order_data.order_items:
            item = OrderItem(
                order_id=order.id,
                book_id=item_data.book_id,
                quantity=item_data.quantity,
                price=item_data.price
            )
            db.add(item)

        db.commit()
        db.refresh(order)
        return OrderRead.model_validate(order)
