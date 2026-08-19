from sqlalchemy import Column, Integer, ForeignKey, Text
from app.models.base import Base


class Transcript(Base):
    __tablename__ = "transcripts"

    id = Column(Integer, primary_key=True)

    meeting_id = Column(
        Integer,
        ForeignKey("meetings.id")
    )

    transcript = Column(Text)