from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.risk import Risk


def get_all_risks(db: Session):
    return (
        db.query(Risk)
        .order_by(Risk.id.desc())
        .all()
    )


def get_risk(db: Session, risk_id: int):

    risk = (
        db.query(Risk)
        .filter(Risk.id == risk_id)
        .first()
    )

    if not risk:
        raise HTTPException(
            status_code=404,
            detail="Risk not found"
        )

    return risk


def create_risk(db: Session, data):

    risk = Risk(
        meeting_id=data.meeting_id,
        title=data.title,
        description=data.description,
        severity=data.severity,
        status=data.status,
    )

    db.add(risk)
    db.commit()
    db.refresh(risk)

    return risk


def update_risk(
    db: Session,
    risk_id: int,
    data
):

    risk = (
        db.query(Risk)
        .filter(Risk.id == risk_id)
        .first()
    )

    if not risk:
        raise HTTPException(
            status_code=404,
            detail="Risk not found"
        )

    if data.title is not None:
        risk.title = data.title

    if data.description is not None:
        risk.description = data.description

    if data.severity is not None:
        risk.severity = data.severity

    if data.status is not None:
        risk.status = data.status

    db.commit()
    db.refresh(risk)

    return risk


def delete_risk(
    db: Session,
    risk_id: int
):

    risk = (
        db.query(Risk)
        .filter(Risk.id == risk_id)
        .first()
    )

    if not risk:
        raise HTTPException(
            status_code=404,
            detail="Risk not found"
        )

    db.delete(risk)
    db.commit()

    return {
        "message": "Risk deleted successfully"
    }