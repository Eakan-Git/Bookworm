from fastapi import HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
import uuid
import os
from dotenv import load_dotenv

from api.v1.schemas.token import TokenResponse
from api.v1.services.token_service import TokenService
from api.v1.services.user import UserService

# Load environment variables
load_dotenv()

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 5))
REFRESH_TOKEN_EXPIRE_MINUTES = int(os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES", 30))

# Cookie settings
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "True").lower() in ("true", "1", "t")
COOKIE_HTTPONLY = True
COOKIE_SAMESITE = "lax"

class AuthController:
    @staticmethod
    def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
        """
        Create a new access token

        Args:
            data: Payload data for the token
            expires_delta: Optional custom expiration time

        Returns:
            JWT access token
        """
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        to_encode.update({"exp": int(expire.timestamp())})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @staticmethod
    def create_refresh_token(data: dict, expires_delta: timedelta = None) -> tuple[str, datetime]:
        """
        Create a new refresh token

        Args:
            data: Payload data for the token
            expires_delta: Optional custom expiration time

        Returns:
            Tuple of (JWT refresh token, expiration datetime)
        """
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES))
        to_encode.update({"exp": int(expire.timestamp())})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt, expire

    @staticmethod
    def login(
        response: Response,
        form_data: OAuth2PasswordRequestForm,
        db: Session
    ) -> TokenResponse:
        """
        Login controller to authenticate users and issue tokens

        Args:
            response: FastAPI response object for setting cookies
            form_data: Form with username (email) and password
            db: Database session

        Returns:
            TokenResponse with access and refresh tokens

        Raises:
            HTTPException: If authentication fails
        """
        # Authenticate user
        user = UserService.authenticate_user(db, form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Generate JWT ID for the refresh token
        jti = str(uuid.uuid4())

        # Create token payloads
        access_token_payload = {
            "sub": user.email,
            "user_id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "admin": user.admin,
        }

        refresh_token_payload = {
            "sub": user.email,
            "user_id": user.id,
            "jti": jti,
        }

        # Create tokens
        access_token = AuthController.create_access_token(access_token_payload)
        refresh_token, expires_at = AuthController.create_refresh_token(refresh_token_payload)

        # Save refresh token in database
        TokenService.create_refresh_token(
            db,
            user_id=user.id,
            jti=jti,
            refresh_token=refresh_token,
            expires_at=expires_at
        )

        # Set cookies
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=COOKIE_HTTPONLY,
            secure=COOKIE_SECURE,
            samesite=COOKIE_SAMESITE,
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=COOKIE_HTTPONLY,
            secure=COOKIE_SECURE,
            samesite=COOKIE_SAMESITE,
            max_age=REFRESH_TOKEN_EXPIRE_MINUTES * 60,
        )

        # Return tokens in response body as well
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token
        )

    @staticmethod
    async def refresh_token(
        response: Response,
        request: Request,
        db: Session
    ) -> TokenResponse:
        """
        Refresh token controller to issue new tokens

        Args:
            response: FastAPI response object for setting cookies
            request: FastAPI request object for getting cookies/body
            db: Database session

        Returns:
            TokenResponse with new access and refresh tokens

        Raises:
            HTTPException: If refresh token is invalid or expired
        """
        # Try to get refresh token from cookie first
        refresh_token = request.cookies.get("refresh_token")

        # If not in cookie, try to get from request body
        if not refresh_token:
            try:
                data = await request.json()
                refresh_token = data.get("refresh_token")
            except:
                pass

        # If still no refresh token, return error
        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing refresh token"
            )

        # Validate refresh token
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
            jti = payload.get("jti")
            email = payload.get("sub")
            user_id = payload.get("user_id")
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )

        # Check if token is valid in database and verify the token hash
        if not TokenService.verify_refresh_token(db, jti, refresh_token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token invalid, revoked, or expired"
            )

        # Revoke the used refresh token (token rotation for security)
        TokenService.revoke_token(db, jti)

        # Get user from database
        user = UserService.get_by_email(db, email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )

        # Create new tokens
        new_jti = str(uuid.uuid4())

        access_token_payload = {
            "sub": user.email,
            "user_id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "admin": user.admin,
        }

        refresh_token_payload = {
            "sub": user.email,
            "user_id": user.id,
            "jti": new_jti,
        }

        # Create tokens
        access_token = AuthController.create_access_token(access_token_payload)
        new_refresh_token, expires_at = AuthController.create_refresh_token(refresh_token_payload)

        # Save new refresh token in database
        TokenService.create_refresh_token(
            db,
            user_id=user.id,
            jti=new_jti,
            refresh_token=new_refresh_token,
            expires_at=expires_at
        )

        # Set cookies
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=COOKIE_HTTPONLY,
            secure=COOKIE_SECURE,
            samesite=COOKIE_SAMESITE,
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )

        response.set_cookie(
            key="refresh_token",
            value=new_refresh_token,
            httponly=COOKIE_HTTPONLY,
            secure=COOKIE_SECURE,
            samesite=COOKIE_SAMESITE,
            max_age=REFRESH_TOKEN_EXPIRE_MINUTES * 60,
        )

        # Return tokens in response body as well
        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token
        )

    @staticmethod
    async def logout(response: Response, request: Request, db: Session) -> dict:
        """
        Logout controller to clear cookies and revoke refresh token

        Args:
            response: FastAPI response object for clearing cookies
            request: FastAPI request object for getting cookies/body
            db: Database session

        Returns:
            Success message
        """
        # Try to get refresh token from cookie first
        refresh_token = request.cookies.get("refresh_token")

        # If not in cookie, try to get from request body
        if not refresh_token:
            try:
                data = await request.json()
                refresh_token = data.get("refresh_token")
            except:
                pass

        # If refresh token exists, revoke it in the database
        if refresh_token:
            try:
                # Decode the token to get the JTI and user_id
                payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
                jti = payload.get("jti")
                user_id = payload.get("user_id")

                # Revoke the specific token if JTI exists
                if jti:
                    TokenService.revoke_token(db, jti)

                # Optional: Revoke all tokens for this user for extra security
                # Uncomment the following lines to enable this behavior
                # if user_id:
                #     TokenService.revoke_all_user_tokens(db, user_id)
            except JWTError:
                # If token is invalid, just continue with logout
                pass

        # Clear cookies
        response.delete_cookie(key="access_token")
        response.delete_cookie(key="refresh_token")

        return {"message": "Successfully logged out"}