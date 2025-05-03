from pydantic import BaseModel


class TokenPayload(BaseModel):
    sub: str  # Subject (email)
    exp: int  # Expiry timestamp
    user_id: int


class AccessTokenPayload(TokenPayload):
    first_name: str
    last_name: str
    admin: bool


class RefreshTokenPayload(TokenPayload):
    jti: str  # Unique ID to revoke or identify the token


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str
