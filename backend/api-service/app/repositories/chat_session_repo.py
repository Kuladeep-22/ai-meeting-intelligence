from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.chat_session import ChatSession


class ChatSessionRepository:

    @staticmethod
    def create(
        db: Session,
        user_id: int,
        title: str = "New Chat"
    ) -> ChatSession:

        session = ChatSession(
            user_id=user_id,
            title=title
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

        result = db.execute(
            select(ChatSession)
            .where(ChatSession.user_id == user_id)
            .order_by(
                ChatSession.updated_at.desc()
            )
        )

        return list(result.scalars().all())

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