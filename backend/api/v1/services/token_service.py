from datetime import datetime, timezone
from sqlmodel import Session, select
from models.token import Token

class TokenService:
    @staticmethod
    def create_refresh_token(db: Session, user_id: int, jti: str, refresh_token: str, expires_at: datetime) -> Token:
        token = Token(
            user_id=user_id,
            jti=jti,
            refresh_token=refresh_token,
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
