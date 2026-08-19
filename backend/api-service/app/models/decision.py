from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.models.base import Base


class Decision(Base):
    __tablename__ = "decisions"

    id = Column(Integer, primary_key=True)

    meeting_id = Column(
        Integer,
        ForeignKey("meetings.id")
    )

    title = Column(String(200))

    description = Column(Text)

    owner = Column(String(100))

    status = Column(String(50))