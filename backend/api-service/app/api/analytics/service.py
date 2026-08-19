from app.models.meeting import Meeting
from app.models.decision import Decision
from app.models.action_item import ActionItem
from app.models.risk import Risk


def get_dashboard_analytics(db):

    meetings = db.query(Meeting).count()

    decisions = db.query(Decision).count()

    action_items = db.query(ActionItem).count()

    risks = db.query(Risk).count()

    completed_tasks = (
        db.query(ActionItem)
        .filter(ActionItem.status == "Completed")
        .count()
    )

    return {
        "total_meetings": meetings,
        "total_decisions": decisions,
        "total_action_items": action_items,
        "total_risks": risks,
        "completed_tasks": completed_tasks,
    }