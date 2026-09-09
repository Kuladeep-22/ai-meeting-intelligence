from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.auth.dependencies import get_current_user
from app.models.user import User
from app.services.chat_service import ChatService

from .service import ask_chatbot


router = APIRouter(
    prefix="/chatbot",
    tags=["chatbot"],
)


class ChatRequest(BaseModel):
    question: str
    context: str = ""


class ChatSessionCreate(BaseModel):
    title: str = "New Chat"
    recipient_id: int | None = None


class ChatSessionResponse(BaseModel):
    id: int
    title: str
    recipient_id: int | None = None
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


@router.post("/ask")
def ask(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    answer = ask_chatbot(
        question=request.question,
        context=request.context,
        db=db,
        user_id=current_user.id,
    )

    return {
        "answer": answer
    }


@router.get("/sessions", response_model=list[ChatSessionResponse])
def get_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sessions = ChatService.get_user_sessions(
        db=db,
        user_id=current_user.id,
    )
    return sessions


@router.post("/sessions", response_model=ChatSessionResponse)
def create_session(
    data: ChatSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = ChatService.create_session(
        db=db,
        user_id=current_user.id,
        title=data.title,
        recipient_id=data.recipient_id,
    )
    return session


@router.get("/sessions/{session_id}/messages")
def get_session_messages(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    messages = ChatService.get_messages(
        db=db,
        session_id=session_id,
    )
    return [
        {
            "id": msg.id,
            "session_id": msg.session_id,
            "sender_id": msg.sender_id,
            "role": msg.role,
            "content": msg.content,
            "created_at": msg.created_at.isoformat() if msg.created_at else None,
        }
        for msg in messages
    ]