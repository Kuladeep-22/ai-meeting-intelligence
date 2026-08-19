from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

from .schemas import (
    RiskCreate,
    RiskUpdate,
)

from .service import *

router = APIRouter(
    prefix="/risks",
    tags=["Risks"]
)


@router.get("/")
def get_all(
    db: Session = Depends(get_db)
):
    return get_all_risks(db)


@router.get("/{risk_id}")
def get_one(
    risk_id: int,
    db: Session = Depends(get_db)
):
    return get_risk(db, risk_id)


@router.post("/")
def create(
    request: RiskCreate,
    db: Session = Depends(get_db)
):
    return create_risk(db, request)


@router.put("/{risk_id}")
def update(
    risk_id: int,
    request: RiskUpdate,
    db: Session = Depends(get_db)
):
    return update_risk(
        db,
        risk_id,
        request
    )


@router.delete("/{risk_id}")
def delete(
    risk_id: int,
    db: Session = Depends(get_db)
):
    return delete_risk(
        db,
        risk_id
    )