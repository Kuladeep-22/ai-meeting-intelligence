import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.auth.dependencies import get_current_user
from app.models.user import User
from app.websocket.notification_socket import manager

from .schemas import (
    MeetingCreate,
    MeetingUpdate,
    RSVPUpdate,
)

from .service import *

router = APIRouter(
    prefix="/meetings",
    tags=["Meetings"]
)


@router.get("/")
def get_all(
    db: Session = Depends(get_db)
):
    return get_all_meetings(db)


@router.get("/mine")
def get_mine(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_meetings_for_user(db, current_user.id)


@router.get("/{meeting_id}")
def get_one(
    meeting_id: int,
    db: Session = Depends(get_db)
):
    return get_meeting(
        db,
        meeting_id
    )


@router.post("/")
async def create(
    request: MeetingCreate,
    db: Session = Depends(get_db)
):
    meeting = create_meeting(
        db,
        request
    )

    for participant in meeting.participants:
        await manager.send_to_user(
            participant.user_id,
            json.dumps({
                "type": "meeting_invite",
                "meeting_id": meeting.id,
                "title": meeting.title,
            }),
        )

    return meeting


@router.put("/{meeting_id}")
def update(
    meeting_id: int,
    request: MeetingUpdate,
    db: Session = Depends(get_db)
):
    return update_meeting(
        db,
        meeting_id,
        request
    )


@router.patch("/{meeting_id}/rsvp")
async def rsvp(
    meeting_id: int,
    request: RSVPUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    participant = update_rsvp(
        db,
        meeting_id,
        current_user.id,
        request.status,
    )

    meeting = get_meeting(db, meeting_id)

    await manager.send_message(
        json.dumps({
            "type": "meeting_rsvp",
            "meeting_id": meeting_id,
            "title": meeting.title,
            "user_id": current_user.id,
            "status": participant.status,
        })
    )

    return participant


@router.delete("/{meeting_id}")
def delete(
    meeting_id: int,
    db: Session = Depends(get_db)
):
    return delete_meeting(
        db,
        meeting_id
    )