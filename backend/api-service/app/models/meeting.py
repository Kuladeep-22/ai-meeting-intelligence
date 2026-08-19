from sqlalchemy import Column, Integer, String, Text
from app.models.base import Base


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)

    description = Column(Text)

    meeting_date = Column(String(50))

    start_time = Column(String(20))

    end_time = Column(String(20))

    organizer = Column(String(100))

    join_url = Column(String(255))