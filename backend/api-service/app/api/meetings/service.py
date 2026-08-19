from datetime import datetime, date
from uuid import uuid4

from fastapi import HTTPException
from app.models.meeting import Meeting
from app.models.meeting_participant import MeetingParticipant
from app.models.notification import Notification


def _meeting_end_date(meeting) -> date | None:
    value = meeting.meeting_date

    # Postgres returns a native date for the DATE column regardless of the
    # String() type declared on the model, so handle both representations.
    if isinstance(value, date):
        return value

    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except (TypeError, ValueError):
        return None


def _purge_expired_meetings(db):
    """Meetings are auto-deleted once their scheduled day has fully passed."""

    today = datetime.now().date()

    meetings = db.query(Meeting).all()

    expired_ids = [
        m.id for m in meetings
        if (end_date := _meeting_end_date(m)) and end_date < today
    ]

    if expired_ids:
        db.query(Meeting).filter(
            Meeting.id.in_(expired_ids)
        ).delete(synchronize_session=False)

        db.commit()


def get_participants(db, meeting_id: int):
    return (
        db.query(MeetingParticipant)
        .filter(MeetingParticipant.meeting_id == meeting_id)
        .all()
    )


def get_all_meetings(db):
    _purge_expired_meetings(db)

    meetings = db.query(Meeting).all()

    for meeting in meetings:
        meeting.participants = get_participants(db, meeting.id)

    return meetings


def get_meeting(db, meeting_id: int):

    _purge_expired_meetings(db)

    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found"
        )

    meeting.participants = get_participants(db, meeting.id)

    return meeting


def create_meeting(db, data):

    meeting = Meeting(
        title=data.title,
        description=data.description,
        meeting_date=data.meeting_date,
        start_time=data.start_time,
        end_time=data.end_time,
        organizer=data.organizer,
        join_url=f"/meet/{uuid4().hex}",
    )

    db.add(meeting)

    db.commit()

    db.refresh(meeting)

    for user_id in set(data.participant_ids or []):

        db.add(
            MeetingParticipant(
                meeting_id=meeting.id,
                user_id=user_id,
                status="invited",
            )
        )

        db.add(
            Notification(
                user_id=user_id,
                title="Meeting invite",
                message=f"You have been invited to '{meeting.title}' on "
                f"{meeting.meeting_date}",
            )
        )

    db.commit()

    db.refresh(meeting)

    meeting.participants = get_participants(db, meeting.id)

    return meeting


def update_meeting(db, meeting_id, data):

    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found"
        )

    if data.title:
        meeting.title = data.title

    if data.description:
        meeting.description = data.description

    if data.meeting_date:
        meeting.meeting_date = data.meeting_date

    if data.start_time:
        meeting.start_time = data.start_time

    if data.end_time:
        meeting.end_time = data.end_time

    if data.organizer:
        meeting.organizer = data.organizer

    db.commit()

    db.refresh(meeting)

    return meeting


def delete_meeting(db, meeting_id):

    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found"
        )

    db.delete(meeting)

    db.commit()

    return {
        "message": "Meeting deleted successfully"
    }


def get_meetings_for_user(db, user_id: int):
    """Meetings where the user is an invited participant."""

    _purge_expired_meetings(db)

    return (
        db.query(Meeting)
        .join(MeetingParticipant)
        .filter(MeetingParticipant.user_id == user_id)
        .all()
    )


def update_rsvp(db, meeting_id: int, user_id: int, status: str):

    if status not in ("accepted", "declined", "tentative"):
        raise HTTPException(
            status_code=400,
            detail="status must be one of: accepted, declined, tentative",
        )

    participant = (
        db.query(MeetingParticipant)
        .filter(
            MeetingParticipant.meeting_id == meeting_id,
            MeetingParticipant.user_id == user_id,
        )
        .first()
    )

    if not participant:
        raise HTTPException(
            status_code=404,
            detail="You are not a participant of this meeting",
        )

    participant.status = status

    db.commit()

    db.refresh(participant)

    return participant