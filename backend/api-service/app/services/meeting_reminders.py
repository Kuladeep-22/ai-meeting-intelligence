import json
from datetime import datetime

from app.db.session import SessionLocal
from app.models.meeting import Meeting
from app.models.meeting_participant import MeetingParticipant
from app.models.notification import Notification
from app.websocket.notification_socket import manager

REMINDER_WINDOW_MINUTES = 10


def _due_participants(db):
    """Participants whose meeting starts within the reminder window and
    haven't been reminded yet."""

    today = datetime.now().date()
    now = datetime.now()

    due = []

    participants = (
        db.query(MeetingParticipant)
        .filter(MeetingParticipant.reminder_sent.is_(False))
        .all()
    )

    for participant in participants:

        meeting = (
            db.query(Meeting)
            .filter(Meeting.id == participant.meeting_id)
            .first()
        )

        if not meeting or not meeting.start_time:
            continue

        try:
            meeting_date = datetime.strptime(
                meeting.meeting_date, "%Y-%m-%d"
            ).date()
        except (TypeError, ValueError):
            continue

        if meeting_date != today:
            continue

        try:
            start_dt = datetime.combine(
                meeting_date,
                datetime.strptime(meeting.start_time, "%H:%M").time(),
            )
        except ValueError:
            continue

        minutes_until_start = (start_dt - now).total_seconds() / 60

        if 0 <= minutes_until_start <= REMINDER_WINDOW_MINUTES:
            due.append((participant, meeting))

    return due


async def send_meeting_reminders():
    """Notify participants of meetings starting soon; runs on a schedule."""

    db = SessionLocal()

    try:
        for participant, meeting in _due_participants(db):

            db.add(
                Notification(
                    user_id=participant.user_id,
                    title="Meeting starting soon",
                    message=f"'{meeting.title}' starts at {meeting.start_time}",
                )
            )

            participant.reminder_sent = True

            db.commit()

            await manager.send_to_user(
                participant.user_id,
                json.dumps({
                    "type": "meeting_reminder",
                    "meeting_id": meeting.id,
                    "title": meeting.title,
                    "start_time": meeting.start_time,
                }),
            )
    finally:
        db.close()
