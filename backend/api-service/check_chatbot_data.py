from app.db.session import SessionLocal

from app.models.meeting import Meeting
from app.models.meeting_participant import MeetingParticipant
from app.models.decision import Decision
from app.models.action_item import ActionItem
from app.models.risk import Risk


db = SessionLocal()

try:
    print("\n========== MEETINGS ==========")

    meetings = db.query(Meeting).all()

    for meeting in meetings:
        print(
            f"ID={meeting.id} | "
            f"Title={meeting.title} | "
            f"Date={meeting.meeting_date}"
        )

    print("\n========== PARTICIPANTS ==========")

    participants = db.query(MeetingParticipant).all()

    for participant in participants:
        print(
            f"Meeting ID={participant.meeting_id} | "
            f"User ID={participant.user_id}"
        )

    print("\n========== DECISIONS ==========")

    decisions = db.query(Decision).all()

    for decision in decisions:
        print(
            f"ID={decision.id} | "
            f"Meeting ID={decision.meeting_id} | "
            f"Title={decision.title}"
        )

    print("\n========== ACTION ITEMS ==========")

    action_items = db.query(ActionItem).all()

    for item in action_items:
        print(
            f"ID={item.id} | "
            f"Meeting ID={item.meeting_id} | "
            f"Title={item.title}"
        )

    print("\n========== RISKS ==========")

    risks = db.query(Risk).all()

    for risk in risks:
        print(
            f"ID={risk.id} | "
            f"Meeting ID={risk.meeting_id} | "
            f"Title={risk.title} | "
            f"Severity={risk.severity} | "
            f"Status={risk.status}"
        )

finally:
    db.close()