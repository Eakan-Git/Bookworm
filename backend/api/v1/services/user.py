from sqlmodel import Session, select
from models.user import User
from api.v1.utils.password import verify_password as verify_pwd
from typing import Optional

class UserService:
    @staticmethod
    def get_by_id(db: Session, user_id: int) -> Optional[User]:
        """
        Get a user by ID

        Args:
            db: Database session
            user_id: User ID to look up

        Returns:
            User object if found, None otherwise
        """
        return db.exec(select(User).where(User.id == user_id)).first()

    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        """
        Get a user by email

        Args:
            db: Database session
            email: Email to look up

        Returns:
            User object if found, None otherwise
        """
        return db.exec(select(User).where(User.email == email)).first()

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user with email and password

        Args:
            db: Database session
            email: User email
            password: Plain text password

        Returns:
            User object if authentication successful, None otherwise
        """
        user = UserService.get_by_email(db, email)
        if not user:
            return None
        if not verify_pwd(password, user.password):
            return None
        return user