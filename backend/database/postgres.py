import os
from sqlmodel import SQLModel, create_engine, Session
from typing import Generator


class PostgresDatabase:
    def __init__(self):
        # Get database credentials from environment variables
        self.POSTGRES_USER = os.getenv("POSTGRES_USER")
        if self.POSTGRES_USER is None:
            raise ValueError("POSTGRES_USER environment variable is not set")

        self.POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
        if self.POSTGRES_PASSWORD is None:
            raise ValueError("POSTGRES_PASSWORD environment variable is not set")

        self.POSTGRES_DB = os.getenv("POSTGRES_DB")
        if self.POSTGRES_DB is None:
            raise ValueError("POSTGRES_DB environment variable is not set")

        # Construct the database URL
        self.DATABASE_URL = os.getenv(
            "DATABASE_URL",
            f"postgresql+psycopg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@db:5432/{self.POSTGRES_DB}"
        )

        # Create the database engine
        self.engine = create_engine(self.DATABASE_URL, echo=True)

    def create_db_and_tables(self):
        # Import models here to avoid circular imports
        from models.user import User
        from models.book import Book
        from models.category import Category
        from models.author import Author
        from models.order import Order
        from models.order_item import OrderItem
        from models.review import Review
        from models.discount import Discount
        # Create tables
        SQLModel.metadata.create_all(self.engine)

    def get_session(self) -> Generator[Session, None, None]:
        # Function to get a database session
        with Session(self.engine) as session:
            yield session
            
    def drop_db(self):
        SQLModel.metadata.drop_all(self.engine)
