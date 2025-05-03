from datetime import datetime, timezone
from sqlmodel import Session, select
from models.token import Token
from api.v1.utils.password import hash_token, verify_token

class TokenService:
    @staticmethod
    def create_refresh_token(db: Session, user_id: int, jti: str, refresh_token: str, expires_at: datetime) -> Token:
        # Hash the refresh token before storing it
        hashed_token = hash_token(refresh_token)

        token = Token(
            user_id=user_id,
            jti=jti,
            refresh_token=hashed_token,
            expires_at=expires_at,
        )
        db.add(token)
        db.commit()
        db.refresh(token)
        return token

    @staticmethod
    def get_by_jti(db: Session, jti: str) -> Token:
        return db.exec(select(Token).where(Token.jti == jti)).first()

    @staticmethod
    def revoke_token(db: Session, jti: str):
        token = TokenService.get_by_jti(db, jti)
        if token:
            token.revoked = True
            db.add(token)
            db.commit()
        return token

    @staticmethod
    def is_valid(db: Session, jti: str) -> bool:
        token = TokenService.get_by_jti(db, jti)
        if token is None or token.revoked:
            return False

        # Handle timezone-aware comparison
        now = datetime.now(timezone.utc)

        # If expires_at is naive (no timezone info), make it timezone-aware
        expires_at = token.expires_at
        if expires_at.tzinfo is None:
            # Convert naive datetime to aware by assuming it's in UTC
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        return expires_at > now

    @staticmethod
    def verify_refresh_token(db: Session, jti: str, plain_refresh_token: str) -> bool:
        """
        Verify a refresh token against the stored hash

        Args:
            db: Database session
            jti: JWT ID
            plain_refresh_token: Plain text refresh token to verify

        Returns:
            True if token is valid and matches the hash, False otherwise
        """
        token = TokenService.get_by_jti(db, jti)
        if token is None or token.revoked:
            return False

        # Verify the token against the stored hash
        if not verify_token(plain_refresh_token, token.refresh_token):
            return False

        # Check if token is expired
        now = datetime.now(timezone.utc)
        expires_at = token.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        return expires_at > now

    @staticmethod
    def revoke_all_user_tokens(db: Session, user_id: int) -> int:
        """
        Revoke all refresh tokens for a specific user

        Args:
            db: Database session
            user_id: User ID to revoke tokens for

        Returns:
            Number of tokens revoked
        """
        # Find all active tokens for the user
        tokens = db.exec(
            select(Token).where(
                Token.user_id == user_id,
                Token.revoked == False
            )
        ).all()

        # Revoke all tokens
        count = 0
        for token in tokens:
            token.revoked = True
            db.add(token)
            count += 1

        # Commit changes if any tokens were revoked
        if count > 0:
            db.commit()

        return count
