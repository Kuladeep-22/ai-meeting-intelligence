from sqlalchemy import Column, Integer, String, ForeignKey
from app.models.base import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)

    meeting_id = Column(
        Integer,
        ForeignKey("meetings.id")
    )

    title = Column(String(200))

    assigned_to = Column(String(100))

    priority = Column(String(30))

    status = Column(String(50))