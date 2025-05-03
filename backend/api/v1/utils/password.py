from passlib.context import CryptContext
import logging

# Create a password context for hashing and verifying passwords
# Include multiple schemes to handle different password formats
# This allows verification of passwords hashed with different algorithms
pwd_context = CryptContext(
    schemes=["bcrypt_sha256", "bcrypt", "pbkdf2_sha256"],
    deprecated="auto"
)

# Create a separate context for refresh tokens with faster hashing
token_context = CryptContext(
    schemes=["sha256_crypt"],
    deprecated="auto"
)

# Set up logging
logger = logging.getLogger(__name__)


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt algorithm

    Args:
        password: Plain text password

    Returns:
        Hashed password
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a hash

    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password to verify against

    Returns:
        True if password matches hash, False otherwise
    """
    try:
        # Try to verify the password using the configured schemes
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        # Log the error for debugging
        logger.warning(f"Password verification error: {str(e)}")
        return False


def hash_token(token: str) -> str:
    """
    Hash a refresh token using SHA-256 algorithm

    Args:
        token: Plain text refresh token

    Returns:
        Hashed token
    """
    return token_context.hash(token)


def verify_token(plain_token: str, hashed_token: str) -> bool:
    """
    Verify a refresh token against a hash

    Args:
        plain_token: Plain text token to verify
        hashed_token: Hashed token to verify against

    Returns:
        True if token matches hash, False otherwise
    """
    try:
        return token_context.verify(plain_token, hashed_token)
    except Exception as e:
        logger.warning(f"Token verification error: {str(e)}")
        return False
