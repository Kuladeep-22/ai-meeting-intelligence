from app.models.meeting import Meeting


class MeetingRepository:

    @staticmethod
    def get_all(db):
        return db.query(Meeting).all()

    @staticmethod
    def get_by_id(db, meeting_id):
        return (
            db.query(Meeting)
            .filter(Meeting.id == meeting_id)
            .first()
        )

    @staticmethod
    def create(db, meeting):

        db.add(meeting)

        db.commit()

        db.refresh(meeting)

        return meeting

    @staticmethod
    def update(db):

        db.commit()

    @staticmethod
    def delete(db, meeting):

        db.delete(meeting)

        db.commit()