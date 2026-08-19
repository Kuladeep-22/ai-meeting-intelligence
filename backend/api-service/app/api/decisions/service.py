from fastapi import HTTPException

from app.models.decision import Decision


def get_all_decisions(db):
    return db.query(Decision).all()


def get_decision(db, decision_id: int):

    decision = (
        db.query(Decision)
        .filter(Decision.id == decision_id)
        .first()
    )

    if not decision:
        raise HTTPException(
            status_code=404,
            detail="Decision not found"
        )

    return decision


def create_decision(db, data):

    decision = Decision(
        meeting_id=data.meeting_id,
        title=data.title,
        description=data.description,
        owner=data.owner,
        status=data.status,
    )

    db.add(decision)
    db.commit()
    db.refresh(decision)

    return decision


def update_decision(db, decision_id, data):

    decision = (
        db.query(Decision)
        .filter(Decision.id == decision_id)
        .first()
    )

    if not decision:
        raise HTTPException(
            status_code=404,
            detail="Decision not found"
        )

    if data.title:
        decision.title = data.title

    if data.description:
        decision.description = data.description

    if data.owner:
        decision.owner = data.owner

    if data.status:
        decision.status = data.status

    db.commit()
    db.refresh(decision)

    return decision


def delete_decision(db, decision_id):

    decision = (
        db.query(Decision)
        .filter(Decision.id == decision_id)
        .first()
    )

    if not decision:
        raise HTTPException(
            status_code=404,
            detail="Decision not found"
        )

    db.delete(decision)
    db.commit()

    return {
        "message": "Decision deleted successfully"
    }