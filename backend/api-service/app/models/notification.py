from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.models.base import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    title = Column(String(200))

    message = Column(String(500))

    is_read = Column(Boolean, default=False)