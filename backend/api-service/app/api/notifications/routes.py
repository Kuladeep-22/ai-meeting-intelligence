from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.db.session import get_db

from .schemas import (
    NotificationCreate,
)

from .service import *

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get("/")
def get_all(
    db: Session = Depends(get_db)
):
    return get_notifications(db)


@router.get("/{notification_id}")
def get_one(
    notification_id: int,
    db: Session = Depends(get_db)
):
    return get_notification(
        db,
        notification_id
    )


@router.post("/")
def create(
    request: NotificationCreate,
    db: Session = Depends(get_db)
):
    return create_notification(
        db,
        request
    )


@router.put("/{notification_id}/read")
def read(
    notification_id: int,
    db: Session = Depends(get_db)
):
    return mark_as_read(
        db,
        notification_id
    )


@router.delete("/{notification_id}")
def delete(
    notification_id: int,
    db: Session = Depends(get_db)
):
    return delete_notification(
        db,
        notification_id
    )