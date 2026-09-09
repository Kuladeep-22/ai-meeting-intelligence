from sqlalchemy import select, and_, or_
from sqlalchemy.orm import Session

from app.models.chat_session import ChatSession


class ChatSessionRepository:

    @staticmethod
    def create(
        db: Session,
        user_id: int,
        title: str = "New Chat",
        recipient_id: int | None = None
    ) -> ChatSession:

        session = ChatSession(
            user_id=user_id,
            title=title,
            recipient_id=recipient_id
        )

        db.add(session)
        db.commit()
        db.refresh(session)

        return session

    @staticmethod
    def get_by_id(
        db: Session,
        session_id: int
    ) -> ChatSession | None:

        result = db.execute(
            select(ChatSession)
            .where(ChatSession.id == session_id)
        )

        return result.scalar_one_or_none()

    @staticmethod
    def get_by_user(
        db: Session,
        user_id: int
    ) -> list[ChatSession]:
        """
        Get all chat sessions for a user.
        Includes sessions where user is the initiator OR the recipient.
        """

        result = db.execute(
            select(ChatSession)
            .where(
                or_(
                    ChatSession.user_id == user_id,
                    ChatSession.recipient_id == user_id
                )
            )
            .order_by(
                ChatSession.updated_at.desc()
            )
        )

        return list(result.scalars().all())

    @staticmethod
    def get_1on1_chat(
        db: Session,
        user_id: int,
        recipient_id: int
    ) -> ChatSession | None:
        """Get existing 1-on-1 chat between two users"""
        
        result = db.execute(
            select(ChatSession)
            .where(
                or_(
                    and_(
                        ChatSession.user_id == user_id,
                        ChatSession.recipient_id == recipient_id
                    ),
                    and_(
                        ChatSession.user_id == recipient_id,
                        ChatSession.recipient_id == user_id
                    )
                )
            )
            .limit(1)
        )

        return result.scalar_one_or_none()

    @staticmethod
    def delete(
        db: Session,
        session: ChatSession
    ) -> None:

        db.delete(session)
        db.commit()

    @staticmethod
    def update_title(
        db: Session,
        session: ChatSession,
        title: str
    ) -> ChatSession:

        session.title = title

        db.commit()
        db.refresh(session)

        return session