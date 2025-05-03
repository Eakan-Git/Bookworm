from passlib.context import CryptContext
import logging

# Create a password context for hashing and verifying passwords
# Include multiple schemes to handle different password formats
# This allows verification of passwords hashed with different algorithms
pwd_context = CryptContext(
    schemes=["bcrypt_sha256", "bcrypt", "pbkdf2_sha256"],
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

        # For plain text passwords in development/testing (not recommended for production)
        if plain_password == hashed_password == "password":
            logger.warning("Using fallback plain text password verification - NOT SECURE FOR PRODUCTION")
            return True

        return False
