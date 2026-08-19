from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

from .schemas import (
    UserCreate,
    UserUpdate,
    UserResponse,
)

from .service import (
    get_all_users,
    get_user_by_id,
    create_user,
    update_user,
    delete_user,
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db)
):
    return get_all_users(db)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    return get_user_by_id(
        db,
        user_id
    )


@router.post("/")
def create(
    request: UserCreate,
    db: Session = Depends(get_db)
):
    return create_user(
        db,
        request
    )


@router.put("/{user_id}")
def update(
    user_id: int,
    request: UserUpdate,
    db: Session = Depends(get_db)
):
    return update_user(
        db,
        user_id,
        request
    )


@router.delete("/{user_id}")
def delete(
    user_id: int,
    db: Session = Depends(get_db)
):
    return delete_user(
        db,
        user_id
    )