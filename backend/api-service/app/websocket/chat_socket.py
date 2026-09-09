from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect
)

from app.db.session import SessionLocal
from app.services.chat_service import ChatService


router = APIRouter()


@router.websocket(
    "/chatbot/ws/{session_id}"
)
async def chat_socket(
    websocket: WebSocket,
    session_id: int
):

    await websocket.accept()

    db = SessionLocal()

    try:

        # Check whether session exists
        session = ChatService.get_session(
            db=db,
            session_id=session_id
        )

        if session is None:

            await websocket.send_json(
                {
                    "type": "error",
                    "message": "Chat session not found"
                }
            )

            await websocket.close()

            return

        # Connection confirmation
        await websocket.send_json(
            {
                "type": "connected",
                "session_id": session_id
            }
        )

        while True:

            data = await websocket.receive_json()

            message_type = data.get(
                "type",
                "message"
            )

            if message_type != "message":
                continue

            message = data.get(
                "message",
                ""
            ).strip()

            if not message:
                continue

            # Tell frontend AI is processing
            await websocket.send_json(
                {
                    "type": "typing",
                    "content": True
                }
            )

            # Process message
            user_message, assistant_message = (
                await ChatService.process_message(
                    db=db,
                    session_id=session_id,
                    message=message
                )
            )

            # Send assistant response
            await websocket.send_json(
                {
                    "type": "assistant_message",
                    "session_id": session_id,
                    "message_id": assistant_message.id,
                    "content": assistant_message.content,
                    "role": "assistant",
                    "created_at": (
                        assistant_message
                        .created_at
                        .isoformat()
                    )
                }
            )

            # Stop typing indicator
            await websocket.send_json(
                {
                    "type": "typing",
                    "content": False
                }
            )

    except WebSocketDisconnect:

        print(
            f"Chat WebSocket disconnected: "
            f"{session_id}"
        )

    except Exception as exc:

        print(
            f"Chat WebSocket error: {exc}"
        )

        try:

            await websocket.send_json(
                {
                    "type": "error",
                    "message": (
                        "An error occurred "
                        "while processing your message."
                    )
                }
            )

        except Exception:
            pass

    finally:

        db.close()