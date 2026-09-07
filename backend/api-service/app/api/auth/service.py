from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)


# ============================================================
# REGISTER USER
# ============================================================

def register_user(
    db: Session,
    full_name: str,
    email: str,
    password: str,
    role: str,
):
    # Check whether email already exists
    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        raise ValueError("Email already registered")

    # Create new user
    user = User(
        full_name=full_name,
        email=email,
        password=hash_password(password),
        role=role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


# ============================================================
# AUTHENTICATE USER
# ============================================================

def authenticate_user(
    db: Session,
    email: str,
    password: str,
):
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        return None

    if not verify_password(
        password,
        user.password,
    ):
        return None

    return user


# ============================================================
# CREATE LOGIN TOKEN
# ============================================================

def create_user_access_token(user: User):
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
    }

    return create_access_token(token_data)