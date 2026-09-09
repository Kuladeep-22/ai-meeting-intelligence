from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.chat_message import ChatMessage


class ChatMessageRepository:

    @staticmethod
    def create(
        db: Session,
        session_id: int,
        role: str,
        content: str,
        sender_id: int | None = None
    ) -> ChatMessage:

        message = ChatMessage(
            session_id=session_id,
            role=role,
            content=content,
            sender_id=sender_id
        )

        db.add(message)
        db.commit()
        db.refresh(message)

        return message

    @staticmethod
    def get_by_session(
        db: Session,
        session_id: int
    ) -> list[ChatMessage]:

        result = db.execute(
            select(ChatMessage)
            .where(
                ChatMessage.session_id == session_id
            )
            .order_by(
                ChatMessage.created_at.asc()
            )
        )

        return list(result.scalars().all())

    @staticmethod
    def get_recent_messages(
        db: Session,
        session_id: int,
        limit: int = 20
    ) -> list[ChatMessage]:

        result = db.execute(
            select(ChatMessage)
            .where(
                ChatMessage.session_id == session_id
            )
            .order_by(
                ChatMessage.created_at.desc()
            )
            .limit(limit)
        )

        messages = list(result.scalars().all())

        messages.reverse()

        return messages