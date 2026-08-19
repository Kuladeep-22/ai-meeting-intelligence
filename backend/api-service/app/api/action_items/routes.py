from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

from .schemas import (
    ActionItemCreate,
    ActionItemUpdate,
)

from .service import *

router = APIRouter(
    prefix="/action-items",
    tags=["Action Items"]
)


@router.get("/")
def get_all(
    db: Session = Depends(get_db)
):
    return get_all_action_items(db)


@router.get("/{item_id}")
def get_one(
    item_id: int,
    db: Session = Depends(get_db)
):
    return get_action_item(db, item_id)


@router.post("/")
def create(
    request: ActionItemCreate,
    db: Session = Depends(get_db)
):
    return create_action_item(db, request)


@router.put("/{item_id}")
def update(
    item_id: int,
    request: ActionItemUpdate,
    db: Session = Depends(get_db)
):
    return update_action_item(
        db,
        item_id,
        request
    )


@router.delete("/{item_id}")
def delete(
    item_id: int,
    db: Session = Depends(get_db)
):
    return delete_action_item(
        db,
        item_id
    )