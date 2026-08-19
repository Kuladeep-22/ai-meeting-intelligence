from app.models.meeting import Meeting
from app.models.decision import Decision
from app.models.action_item import ActionItem
from app.models.risk import Risk


class AnalyticsService:

    @staticmethod
    def dashboard(db):

        return {
            "meetings": db.query(Meeting).count(),
            "decisions": db.query(Decision).count(),
            "tasks": db.query(ActionItem).count(),
            "risks": db.query(Risk).count(),
        }