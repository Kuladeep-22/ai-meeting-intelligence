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


def _prepare_password(password: str) -> str:
    """
    Prepare password before passing it to bcrypt.

    bcrypt has a maximum password length of 72 bytes.
    Since UTF-8 characters can occupy multiple bytes,
    we truncate based on bytes rather than characters.
    """

    password_bytes = password.encode("utf-8")

    if len(password_bytes) <= MAX_BCRYPT_PASSWORD_BYTES:
        return password

    # Truncate to 72 bytes
    password_bytes = password_bytes[
        :MAX_BCRYPT_PASSWORD_BYTES
    ]

    # Safely decode UTF-8 without leaving a broken character
    return password_bytes.decode(
        "utf-8",
        errors="ignore",
    )


def hash_password(password: str) -> str:
    """
    Hash a plain-text password using bcrypt.
    """

    password = _prepare_password(password)

    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify a plain-text password against a bcrypt hash.
    """

    plain_password = _prepare_password(
        plain_password
    )

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