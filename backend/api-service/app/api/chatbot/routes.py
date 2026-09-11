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
    recipient_name: str | None = None
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True
        orm_mode = True


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

    response = []

    # ============================================== # AI chat # ==============================================
    
    if session.recipient_id is None:
        
        response.append(
            {
                "id": session.id,
                "title": session.title,
                "recipient_id": None,
                "created_at": session.created_at.isoformat() if session.created_at else "",
                "updated_at": session.updated_at.isoformat() if session.updated_at else "",
            }
        )


    # ============================================== # Direct user-to-user chat # ==============================================

    if session.user_id == current_user.id:
        other_user_id = session.recipient_id
    else:
        other_user_id = session.user_id

    other_user = db.query(User).filter(User.id == other_user_id).first()

    if other_user:

        title =(f"Chat with "
                f"{other_user.full_name}"
        )
    else:
        title = "Direct Message"

    response.append(
        {
            "id": session.id,
            "title": title,
            "recipient_id": session.recipient_id,
            "created_at": session.created_at.isoformat() if session.created_at else "",
            "updated_at": session.updated_at.isoformat() if session.updated_at else "",
        }
    )
    return response
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
    session = ChatService.get_session(
        db=db,
        session_id=session_id,
    )

    if session is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Chat session not found")

    #Only participants can access messages
    if (
        session.user_id != current_user.id and session.recipient_id != current_user.id
    ):
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="You are not a participant in this chat")

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