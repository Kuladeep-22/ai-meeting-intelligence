from app.database import Base, engine

# Import all models so SQLAlchemy knows about them
from app.models.user import User
from app.models.meeting import Meeting
from app.models.decision import Decision
from app.models.action_item import ActionItem
from app.models.risk import Risk
from app.models.base import Base
from app.models.comment import Comment
from app.models.meeting_participant import MeetingParticipant
from app.models.notification import Notification
from app.models.task import Task
from app.models.team import Team
from app.models.transcript import Transcript

print("Creating database tables...")

Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")