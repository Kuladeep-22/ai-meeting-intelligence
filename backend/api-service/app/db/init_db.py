from app.db.session import engine

from app.models.user import User
from app.models.team import Team
from app.models.meeting import Meeting
from app.models.decision import Decision
from app.models.action_item import ActionItem
from app.models.risk import Risk
from app.models.notification import Notification


def init_db():

    User.metadata.create_all(bind=engine)

    Team.metadata.create_all(bind=engine)

    Meeting.metadata.create_all(bind=engine)

    Decision.metadata.create_all(bind=engine)

    ActionItem.metadata.create_all(bind=engine)

    Risk.metadata.create_all(bind=engine)

    Notification.metadata.create_all(bind=engine)


if __name__ == "__main__":

    init_db()

    print("Database tables created.")