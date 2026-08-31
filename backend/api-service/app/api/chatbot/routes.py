from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.auth.dependencies import get_current_user
from app.models.user import User

from .service import ask_chatbot


router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    context: str = ""


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