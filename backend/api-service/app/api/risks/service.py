from fastapi import HTTPException

from app.models.risk import Risk


def get_all_risks(db):
    return db.query(Risk).all()


def get_risk(db, risk_id: int):

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


def create_risk(db, data):

    risk = Risk(
        meeting_id=data.meeting_id,
        title=data.title,
        description=data.description,
        severity=data.severity,
        owner=data.owner,
        status=data.status,
    )

    db.add(risk)
    db.commit()
    db.refresh(risk)

    return risk


def update_risk(db, risk_id, data):

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

    if data.title:
        risk.title = data.title

    if data.description:
        risk.description = data.description

    if data.severity:
        risk.severity = data.severity

    if data.owner:
        risk.owner = data.owner

    if data.status:
        risk.status = data.status

    db.commit()
    db.refresh(risk)

    return risk


def delete_risk(db, risk_id):

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