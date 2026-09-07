from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings


# ============================================================
# PASSWORD HASHING
# ============================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

# bcrypt supports a maximum of 72 bytes
MAX_BCRYPT_PASSWORD_BYTES = 72


def validate_password_length(password: str) -> None:
    """
    Validate password length for bcrypt.

    bcrypt supports a maximum of 72 bytes.
    """

    password_bytes = len(
        password.encode("utf-8")
    )

    if password_bytes > MAX_BCRYPT_PASSWORD_BYTES:
        raise ValueError(
            "Password must be 72 bytes or fewer."
        )


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    """

    validate_password_length(password)

    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify a password against a bcrypt hash.
    """

    validate_password_length(plain_password)

    return pwd_context.verify(
        plain_password,
        hashed_password,
    )


# ============================================================
# JWT
# ============================================================

def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:
    """
    Create a JWT access token.
    """

    payload = data.copy()

    if expires_delta is None:
        expires_delta = timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    expire = (
        datetime.now(timezone.utc)
        + expires_delta
    )

    payload["exp"] = expire

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )