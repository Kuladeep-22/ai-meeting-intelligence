from app.models.meeting import Meeting

from app.repositories.meeting_repo import (
    MeetingRepository,
)


class MeetingService:

    @staticmethod
    def create(db, request):

        meeting = Meeting(
            title=request.title,
            description=request.description,
            meeting_date=request.meeting_date,
            organizer=request.organizer,
        )

        return MeetingRepository.create(
            db,
            meeting
        )

    @staticmethod
    def get_all(db):
        return MeetingRepository.get_all(db)

    @staticmethod
    def get_by_id(db, meeting_id):
        return MeetingRepository.get_by_id(
            db,
            meeting_id
        )