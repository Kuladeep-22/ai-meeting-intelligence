from sqlalchemy import Column, Integer, Text, ForeignKey
from app.models.base import Base


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True)

    meeting_id = Column(
        Integer,
        ForeignKey("meetings.id")
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    comment = Column(Text)