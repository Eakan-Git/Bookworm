from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field

# Create a function that returns the current UTC time
def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)

class Token(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    jti: str = Field(index=True, unique=True)  # JWT ID
    refresh_token: str
    created_at: datetime = Field(default_factory=get_utc_now)
    expires_at: datetime
    revoked: bool = Field(default=False)
