from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from app.models.base import Base


class Risk(Base):
    __tablename__ = "risks"

    id = Column(Integer, primary_key=True, index=True)

    meeting_id = Column(
        Integer,
        ForeignKey("meetings.id"),
        nullable=False
    )

    title = Column(
        String(200),
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    severity = Column(
        String(50),
        nullable=False
    )

    status = Column(
        String(50),
        nullable=False,
        default="Open"
    )

    created_at = Column(
        DateTime,
        nullable=True
    )