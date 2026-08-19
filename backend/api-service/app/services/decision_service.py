from app.models.decision import Decision

from app.repositories.decision_repo import (
    DecisionRepository,
)


class DecisionService:

    @staticmethod
    def create(db, request):

        decision = Decision(
            meeting_id=request.meeting_id,
            title=request.title,
            description=request.description,
            owner=request.owner,
            status=request.status,
        )

        return DecisionRepository.create(
            db,
            decision
        )

    @staticmethod
    def get_all(db):
        return DecisionRepository.get_all(db)

    @staticmethod
    def get_by_id(db, decision_id):
        return DecisionRepository.get_by_id(
            db,
            decision_id
        )