from sqlalchemy import Column, Integer, String, ForeignKey
from app.models.base import Base


class Risk(Base):
    __tablename__ = "risks"

    id = Column(Integer, primary_key=True)

    meeting_id = Column(
        Integer,
        ForeignKey("meetings.id")
    )

    title = Column(String(200))

    assigned_to = Column(String(100))

    deadline = Column(String(50))

    status = Column(String(50))