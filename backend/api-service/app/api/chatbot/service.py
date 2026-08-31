import requests

from sqlalchemy.orm import Session

from app.models.meeting import Meeting
from app.models.meeting_participant import MeetingParticipant
from app.models.decision import Decision
from app.models.action_item import ActionItem
from app.models.risk import Risk


AI_SERVICE_URL = "http://localhost:5000/api/v1/chat"


# ============================================================
# Get meetings belonging to the logged-in user
# ============================================================

def get_user_meetings(
    db: Session,
    user_id: int,
):

    return  (
        db.query(Meeting)
        .join(
            MeetingParticipant,
            MeetingParticipant.meeting_id == Meeting.id,
        )
        .filter(
            MeetingParticipant.user_id == user_id,
        )
        .order_by(
            Meeting.meeting_date.desc(),
            Meeting.id.desc(),
        )
        .all()
    )

# ============================================================
# Build complete assistant context
# ============================================================

def build_assistant_context(
    db: Session,
    user_id: int,
):
    """
    Build complete meeting intelligence context for the
    authenticated user.

    Includes:

    - Meetings
    - Decisions
    - Action items
    - Risks

    Only information belonging to the user's meetings is included.
    """

    meetings = get_user_meetings(
        db=db,
        user_id=user_id,
    )

    # --------------------------------------------------------
    # No meetings
    # --------------------------------------------------------

    if not meetings:
        return """
USER MEETING INTELLIGENCE
============================================================

NO USER MEETINGS FOUND

The database currently contains no meetings associated with
the authenticated user.

Do NOT invent meetings, decisions, action items, or risks.
"""

    # --------------------------------------------------------
    # Meeting IDs
    # --------------------------------------------------------

    meeting_ids = [
        meeting.id
        for meeting in meetings
    ]

    # --------------------------------------------------------
    # Decisions
    # --------------------------------------------------------

    decisions = (
        db.query(Decision)
        .filter(
            Decision.meeting_id.in_(meeting_ids)
        )
        .order_by(
            Decision.id.desc()
        )
        .all()
    )

    # --------------------------------------------------------
    # Action Items
    # --------------------------------------------------------

    action_items = (
        db.query(ActionItem)
        .filter(
            ActionItem.meeting_id.in_(meeting_ids)
        )
        .order_by(
            ActionItem.id.desc()
        )
        .all()
    )

    # --------------------------------------------------------
    # Risks
    # --------------------------------------------------------

    risks = (
        db.query(Risk)
        .filter(
            Risk.meeting_id.in_(meeting_ids)
        )
        .order_by(
            Risk.id.desc()
        )
        .all()
    )

    # --------------------------------------------------------
    # Build context
    # --------------------------------------------------------

    lines = []

    lines.append("USER MEETING INTELLIGENCE")
    lines.append("=" * 60)

    # ========================================================
    # MEETINGS
    # ========================================================

    lines.append("")
    lines.append("MEETINGS")
    lines.append("-" * 60)

    for meeting in meetings:

        lines.append(
            f"Meeting ID: {meeting.id}"
        )

        lines.append(
            f"Title: {meeting.title or 'Not specified'}"
        )

        lines.append(
            f"Description: "
            f"{getattr(meeting, 'description', None) or 'Not specified'}"
        )

        lines.append(
            f"Date: "
            f"{meeting.meeting_date or 'Not specified'}"
        )

        lines.append(
            f"Start Time: "
            f"{meeting.start_time or 'Not specified'}"
        )

        lines.append(
            f"End Time: "
            f"{meeting.end_time or 'Not specified'}"
        )

        lines.append(
            f"Organizer: "
            f"{meeting.organizer or 'Not specified'}"
        )

        lines.append(
            f"Join URL: "
            f"{meeting.join_url or 'Not specified'}"
        )

        lines.append("")

    # ========================================================
    # DECISIONS
    # ========================================================

    lines.append("")
    lines.append("DECISIONS")
    lines.append("-" * 60)

    if decisions:

        for decision in decisions:

            lines.append(
                f"Decision ID: {decision.id}"
            )

            lines.append(
                f"Meeting ID: {decision.meeting_id}"
            )

            lines.append(
                f"Title: "
                f"{decision.title or 'Not specified'}"
            )

            lines.append(
                f"Description: "
                f"{decision.description or 'Not specified'}"
            )

            lines.append(
                f"Owner: "
                f"{getattr(decision, 'owner', None) or 'Not specified'}"
            )

            lines.append(
                f"Status: "
                f"{decision.status or 'Not specified'}"
            )

            lines.append("")

    else:

        lines.append("No decisions recorded.")

    # ========================================================
    # ACTION ITEMS
    # ========================================================

    lines.append("")
    lines.append("ACTION ITEMS")
    lines.append("-" * 60)

    if action_items:

        for item in action_items:

            lines.append(
                f"Action Item ID: {item.id}"
            )

            lines.append(
                f"Meeting ID: {item.meeting_id}"
            )

            lines.append(
                f"Title: "
                f"{item.title or 'Not specified'}"
            )

            lines.append(
                f"Assigned To: "
                f"{getattr(item, 'assigned_to', None) or 'Not specified'}"
            )

            lines.append(
                f"Deadline: "
                f"{getattr(item, 'deadline', None) or 'Not specified'}"
            )

            lines.append(
                f"Status: "
                f"{item.status or 'Not specified'}"
            )

            lines.append("")

    else:

        lines.append("No action items recorded.")

    # ========================================================
    # RISKS
    # ========================================================

    lines.append("")
    lines.append("RISKS")
    lines.append("-" * 60)

    if risks:

        for risk in risks:

            lines.append(
                f"Risk ID: {risk.id}"
            )

            lines.append(
                f"Meeting ID: {risk.meeting_id}"
            )

            lines.append(
                f"Title: "
                f"{risk.title or 'Not specified'}"
            )

            lines.append(
                f"Description: "
                f"{risk.description or 'Not specified'}"
            )

            lines.append(
                f"Severity: "
                f"{risk.severity or 'Not specified'}"
            )

            lines.append(
                f"Status: "
                f"{risk.status or 'Not specified'}"
            )

            lines.append(
                f"Created At: "
                f"{getattr(risk, 'created_at', None) or 'Not specified'}"
            )

            lines.append("")

    else:

        lines.append("No risks recorded.")

    return "\n".join(lines)


# ============================================================
# Ask AI chatbot
# ============================================================

def ask_chatbot(
    question: str,
    context: str = "",
    db: Session = None,
    user_id: int = None,
):

    try:

        # ----------------------------------------------------
        # Build database context
        # ----------------------------------------------------

        database_context = ""

        if db is not None and user_id is not None:

            database_context = build_assistant_context(
                db=db,
                user_id=user_id,
            )

        # ----------------------------------------------------
        # Combine contexts
        # ----------------------------------------------------

        if context:

            combined_context = (
                f"{database_context}\n\n"
                "ADDITIONAL USER CONTEXT\n"
                f"{'=' * 60}\n"
                f"{context}"
            )

        else:

            combined_context = database_context

        # ----------------------------------------------------
        # Debug
        # ----------------------------------------------------

        print("")
        print("============================================================")
        print("CHATBOT USER ID")
        print("============================================================")
        print(user_id)

        print("")
        print("============================================================")
        print("CHATBOT QUESTION")
        print("============================================================")
        print(question)

        print("")
        print("============================================================")
        print("CHATBOT DATABASE CONTEXT")
        print("============================================================")
        print(combined_context)

        # ----------------------------------------------------
        # Call AI service
        # ----------------------------------------------------

        response = requests.post(
            AI_SERVICE_URL,
            json={
                "question": question,
                "context": combined_context,
            },
            timeout=120,
        )

        print("")
        print("============================================================")
        print("AI SERVICE RESPONSE")
        print("============================================================")
        print("STATUS:", response.status_code)
        print("BODY:", response.text)
        print("============================================================")

        response.raise_for_status()

        data = response.json()

        return data.get(
            "answer",
            "No answer received from AI service.",
        )

    except requests.exceptions.RequestException as e:

        print("")
        print("============================================================")
        print("AI SERVICE ERROR")
        print("============================================================")
        print(type(e).__name__, str(e))
        print("============================================================")

        return f"AI Service Error: {str(e)}"

    except Exception as e:

        print("")
        print("============================================================")
        print("CHATBOT ERROR")
        print("============================================================")
        print(type(e).__name__, str(e))
        print("============================================================")

        return f"Chatbot Error: {str(e)}"