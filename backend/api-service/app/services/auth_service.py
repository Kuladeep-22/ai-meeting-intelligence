from fastapi import HTTPException

from app.models.user import User

from app.repositories.user_repo import UserRepository

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)


class AuthService:

    @staticmethod
    def register(db, request):

        if UserRepository.get_by_email(
            db,
            request.email
        ):
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

        user = User(
            full_name=request.full_name,
            email=request.email,
            password=hash_password(
                request.password
            ),
        )

        return UserRepository.create(
            db,
            user
        )

    @staticmethod
    def login(db, request):

        user = UserRepository.get_by_email(
            db,
            request.email
        )

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )

        if not verify_password(
            request.password,
            user.password
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )

        token = create_access_token(
            {
                "sub": str(user.id)
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer"
        }