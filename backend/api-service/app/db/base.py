from app.models.team import Team
from app.models.meeting import Meeting
from app.models.meeting_participant import MeetingParticipant
from app.models.decision import Decision
from app.models.action_item import ActionItem
from app.models.risk import Risk
from app.models.notification import Notification
from sqlalchemy.orm import declarative_base

Base = declarative_base()