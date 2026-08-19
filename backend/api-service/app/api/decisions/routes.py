from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

from .schemas import (
    DecisionCreate,
    DecisionUpdate,
)

from .service import *

router = APIRouter(
    prefix="/decisions",
    tags=["Decisions"]
)


@router.get("/")
def get_all(
    db: Session = Depends(get_db)
):
    return get_all_decisions(db)


@router.get("/{decision_id}")
def get_one(
    decision_id: int,
    db: Session = Depends(get_db)
):
    return get_decision(db, decision_id)


@router.post("/")
def create(
    request: DecisionCreate,
    db: Session = Depends(get_db)
):
    return create_decision(db, request)


@router.put("/{decision_id}")
def update(
    decision_id: int,
    request: DecisionUpdate,
    db: Session = Depends(get_db)
):
    return update_decision(
        db,
        decision_id,
        request
    )


@router.delete("/{decision_id}")
def delete(
    decision_id: int,
    db: Session = Depends(get_db)
):
    return delete_decision(
        db,
        decision_id
    )