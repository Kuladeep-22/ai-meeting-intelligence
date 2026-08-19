from app.models.decision import Decision


class DecisionRepository:

    @staticmethod
    def get_all(db):
        return db.query(Decision).all()

    @staticmethod
    def get_by_id(db, decision_id):
        return (
            db.query(Decision)
            .filter(Decision.id == decision_id)
            .first()
        )

    @staticmethod
    def create(db, decision):

        db.add(decision)

        db.commit()

        db.refresh(decision)

        return decision

    @staticmethod
    def delete(db, decision):

        db.delete(decision)

        db.commit()