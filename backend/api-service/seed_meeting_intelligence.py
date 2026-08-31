from app.db.session import SessionLocal

# IMPORTANT:
# Import all related models so SQLAlchemy knows about
# the meetings table and all foreign-key relationships.
from app.models.user import User
from app.models.meeting import Meeting
from app.models.meeting_participant import MeetingParticipant
from app.models.decision import Decision
from app.models.action_item import ActionItem
from app.models.risk import Risk


MEETING_ID = 17
USER_ID = 5


def seed_data():

    db = SessionLocal()

    try:

        # =========================================================
        # VERIFY USER
        # =========================================================

        user = (
            db.query(User)
            .filter(User.id == USER_ID)
            .first()
        )

        if not user:
            raise RuntimeError(
                f"User {USER_ID} does not exist."
            )

        print(
            f"User: {user.id} | "
            f"{user.full_name} | "
            f"{user.email}"
        )

        # =========================================================
        # VERIFY MEETING
        # =========================================================

        meeting = (
            db.query(Meeting)
            .filter(Meeting.id == MEETING_ID)
            .first()
        )

        if not meeting:
            raise RuntimeError(
                f"Meeting {MEETING_ID} does not exist."
            )

        print(
            f"Meeting: {meeting.id} | "
            f"{meeting.title} | "
            f"{meeting.meeting_date}"
        )

        # =========================================================
        # VERIFY PARTICIPANT
        # =========================================================

        participant = (
            db.query(MeetingParticipant)
            .filter(
                MeetingParticipant.meeting_id == MEETING_ID,
                MeetingParticipant.user_id == USER_ID,
            )
            .first()
        )

        if not participant:
            raise RuntimeError(
                f"User {USER_ID} is not a participant "
                f"of meeting {MEETING_ID}."
            )

        print(
            f"Participant found: "
            f"user={USER_ID}, "
            f"meeting={MEETING_ID}"
        )

        # =========================================================
        # REMOVE EXISTING SEEDED DATA
        #
        # This makes the script safe to run repeatedly.
        # =========================================================

        db.query(Decision).filter(
            Decision.meeting_id == MEETING_ID
        ).delete(synchronize_session=False)

        db.query(ActionItem).filter(
            ActionItem.meeting_id == MEETING_ID
        ).delete(synchronize_session=False)

        db.query(Risk).filter(
            Risk.meeting_id == MEETING_ID
        ).delete(synchronize_session=False)

        db.flush()

        # =========================================================
        # DECISION
        # =========================================================

        decision = Decision(
            meeting_id=MEETING_ID,

            title="Release moved to October",

            description=(
                "Owner: Rahul\n"
                "Date: 18 Aug 2026\n"
                "Status: Approved\n\n"

                "DECISION HISTORY\n"
                "Version 1 - Release in September - 10 Aug 2026\n"
                "Version 2 - Release in October - 18 Aug 2026\n"
                "Version 3 - Release in November - 28 Aug 2026\n\n"

                "DECISION TIMELINE\n"
                "Requirement Approved\n"
                "Development Started\n"
                "Release Changed to October\n"
                "Final Release Approved"
            ),

            owner="Rahul",

            status="Approved",
        )

        db.add(decision)

        # =========================================================
        # ACTION ITEM 1
        # =========================================================

        action_item_1 = ActionItem(
            meeting_id=MEETING_ID,

            title="Prepare October release plan",

            assigned_to="Rahul",

            deadline="2026-09-15",

            status="Pending",
        )

        # =========================================================
        # ACTION ITEM 2
        # =========================================================

        action_item_2 = ActionItem(
            meeting_id=MEETING_ID,

            title="Complete release readiness review",

            assigned_to="Development Team",

            deadline="2026-09-20",

            status="Pending",
        )

        db.add(action_item_1)
        db.add(action_item_2)

        # =========================================================
        # RISK 1
        # =========================================================

        risk_1 = Risk(
            meeting_id=MEETING_ID,

            title="October release delay",

            description=(
                "The October release may be delayed "
                "if development and testing are not "
                "completed on schedule."
            ),

            severity="Medium",

            status="Open",
        )

        # =========================================================
        # RISK 2
        # =========================================================

        risk_2 = Risk(
            meeting_id=MEETING_ID,

            title="Insufficient testing time",

            description=(
                "Moving the release date may reduce "
                "the available time for final testing "
                "and release validation."
            ),

            severity="High",

            status="Open",
        )

        db.add(risk_1)
        db.add(risk_2)

        # =========================================================
        # COMMIT
        # =========================================================

        db.commit()

        print()
        print("======================================")
        print("SEED SUCCESSFUL")
        print("======================================")
        print(f"Meeting:       {MEETING_ID}")
        print(f"Decision:      {decision.title}")
        print(f"Action Items:  2")
        print(f"Risks:         2")
        print("======================================")

    except Exception as e:

        db.rollback()

        print()
        print("======================================")
        print("SEED FAILED")
        print("======================================")
        print(type(e).__name__)
        print(str(e))
        print("======================================")

        raise

    finally:

        db.close()


if __name__ == "__main__":
    seed_data()