import httpx

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.chat_session import ChatSession
from app.models.chat_message import ChatMessage
from app.repositories.chat_session_repo import (
    ChatSessionRepository
)
from app.repositories.chat_message_repo import (
    ChatMessageRepository
)


class ChatService:

    @staticmethod
    def create_session(
        db: Session,
        user_id: int,
        title: str = "New Chat",
        recipient_id: int | None = None
    ) -> ChatSession:

        # For 1-on-1 chats, check if one already exists
        if recipient_id:
            existing_session = (
                ChatSessionRepository
                .get_1on1_chat(
                    db=db,
                    user_id=user_id,
                    recipient_id=recipient_id
                )
            )

            if existing_session:
                return existing_session

        return ChatSessionRepository.create(
            db=db,
            user_id=user_id,
            title=title,
            recipient_id=recipient_id
        )

    @staticmethod
    def get_user_sessions(
        db: Session,
        user_id: int
    ) -> list[ChatSession]:

        return ChatSessionRepository.get_by_user(
            db=db,
            user_id=user_id
        )

    @staticmethod
    def get_session(
        db: Session,
        session_id: int
    ) -> ChatSession | None:

        return ChatSessionRepository.get_by_id(
            db=db,
            session_id=session_id
        )

    @staticmethod
    def get_messages(
        db: Session,
        session_id: int
    ) -> list[ChatMessage]:

        return ChatMessageRepository.get_by_session(
            db=db,
            session_id=session_id
        )

    @staticmethod
    def save_user_message(
        db: Session,
        session_id: int,
        content: str,
        sender_id: int | None = None
    ) -> ChatMessage:

        return ChatMessageRepository.create(
            db=db,
            session_id=session_id,
            role="user",
            content=content,
            sender_id=sender_id
        )

    @staticmethod
    def save_assistant_message(
        db: Session,
        session_id: int,
        content: str,
        sender_id: int | None = None
    ) -> ChatMessage:

        return ChatMessageRepository.create(
            db=db,
            session_id=session_id,
            role="assistant",
            content=content,
            sender_id=sender_id
        )

    @staticmethod
    async def get_ai_response(
        message: str,
        session_id: int,
        db: Session
    ) -> str:

        history = (
            ChatMessageRepository
            .get_recent_messages(
                db=db,
                session_id=session_id,
                limit=20
            )
        )

        conversation = []

        for item in history:
            conversation.append(
                {
                    "role": item.role,
                    "content": item.content
                }
            )

        try:

            ai_url = (
                getattr(
                    settings,
                    "AI_SERVICE_URL",
                    f"{settings.FLASK_AI_URL}/api/v1/chat"
                )
            )

            payload = {
                "message": message,
                "session_id": session_id,
                "conversation": conversation
            }

            async with httpx.AsyncClient(
                timeout=60.0
            ) as client:

                response = await client.post(
                    ai_url,
                    json=payload
                )

                response.raise_for_status()

                data = response.json()

                return data.get(
                    "response",
                    "I couldn't generate a response."
                )

        except Exception as exc:

            print(
                f"AI service error: {exc}"
            )

            return (
                "I'm unable to connect to the "
                "AI service right now. Please try again."
            )

    @staticmethod
    async def process_message(
        db: Session,
        session_id: int,
        message: str
    ) -> tuple[ChatMessage, ChatMessage]:

        # Save user message
        user_message = (
            ChatService.save_user_message(
                db=db,
                session_id=session_id,
                content=message
            )
        )

        # Get AI response
        ai_response = (
            await ChatService.get_ai_response(
                message=message,
                session_id=session_id,
                db=db
            )
        )

        # Save AI response
        assistant_message = (
            ChatService.save_assistant_message(
                db=db,
                session_id=session_id,
                content=ai_response
            )
        )

        return (
            user_message,
            assistant_message
        )