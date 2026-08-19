from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User

from app.api.auth.schemas import (
    RegisterRequest,
    LoginRequest,
)

from app.api.auth.service import (
    register_user,
    verify_password,
    create_access_token,
)

from app.api.auth.dependencies import (
    get_current_user,
)


router = APIRouter()


# ==================================================
# REGISTER
# ==================================================

@router.post("/register")
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db),
):

    try:

        user = register_user(
            db=db,
            full_name=data.full_name,
            email=str(data.email),
            password=data.password,
        )

        return {
            "success": True,
            "message": "Registration successful",
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role,
            },
        }

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# ==================================================
# LOGIN
# ==================================================

@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
):

    user = (
        db.query(User)
        .filter(
            User.email == str(data.email)
        )
        .first()
    )

    if user is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    try:

        password_valid = verify_password(
            data.password,
            user.password,
        )

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to verify password",
        )

    if not password_valid:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    access_token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email,
        }
    )

    return {
        "success": True,
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
        },
    }


# ==================================================
# CURRENT USER
# ==================================================

@router.get("/me")
def me(
    current_user: User = Depends(
        get_current_user
    ),
):

    return {
        "success": True,
        "message": "Current user retrieved successfully",
        "user": {
            "id": current_user.id,
            "full_name": current_user.full_name,
            "email": current_user.email,
            "role": current_user.role,
        },
    }