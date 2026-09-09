from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.chat_service import ChatService


router = APIRouter(
    prefix="/chat",
    tags=["Chatbot"]
)


class ConversationMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=5000
    )

    session_id: int | None = None

    conversation: list[ConversationMessage] = Field(
        default_factory=list
    )


class ChatResponse(BaseModel):
    response: str
    session_id: int | None = None


@router.post(
    "",
    response_model=ChatResponse
)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Process a chat message.

    Receives:
    - Current user message
    - Session ID
    - Previous conversation history

    Returns:
    - AI-generated response
    """

    try:

        conversation = [
            {
                "role": message.role,
                "content": message.content
            }
            for message in request.conversation
        ]

        response = await ChatService.generate_response(
            message=request.message,
            conversation=conversation,
            session_id=request.session_id
        )

        return ChatResponse(
            response=response,
            session_id=request.session_id
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    except Exception as exc:

        print(
            f"Chatbot error: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate AI response."
        )