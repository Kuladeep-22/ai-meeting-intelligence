from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
    Query,
)

from jose import jwt, JWTError

from app.db.session import SessionLocal
from app.services.chat_service import ChatService
from app.core.config import settings


router = APIRouter()


class ConnectionManager:
    """
    Keeps track of all active WebSocket connections.

    Each chat session can have multiple connected users.
    """

    def __init__(self):
        self.active_connections: dict[
            int, list[WebSocket]
        ] = {}

    async def connect(
        self,
        session_id: int,
        websocket: WebSocket,
    ):
        if session_id not in self.active_connections:
            self.active_connections[session_id] = []

        self.active_connections[session_id].append(
            websocket
        )

    def disconnect(
        self,
        session_id: int,
        websocket: WebSocket,
    ):
        connections = self.active_connections.get(
            session_id,
            []
        )

        if websocket in connections:
            connections.remove(websocket)

        if not connections:
            self.active_connections.pop(
                session_id,
                None
            )

    async def broadcast(
        self,
        session_id: int,
        message: dict,
    ):
        connections = self.active_connections.get(
            session_id,
            []
        )

        disconnected = []

        for connection in connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)

        for connection in disconnected:
            self.disconnect(
                session_id,
                connection
            )


manager = ConnectionManager()


@router.websocket(
    "/chatbot/ws/{session_id}"
)
async def chat_socket(
    websocket: WebSocket,
    session_id: int,
    token: str = Query(None),
):
    await websocket.accept()

    db = SessionLocal()

    user_id = None

    # ==================================================
    # Authenticate user
    # ==================================================

    if not token:
        await websocket.send_json(
            {
                "type": "error",
                "message": "Authentication token required",
            }
        )

        await websocket.close()
        db.close()
        return

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        user_id = int(payload.get("sub"))

    except (
        JWTError,
        TypeError,
        ValueError,
    ):
        await websocket.send_json(
            {
                "type": "error",
                "message": "Invalid token",
            }
        )

        await websocket.close()
        db.close()
        return

    try:

        # ==================================================
        # Get chat session
        # ==================================================

        session = ChatService.get_session(
            db=db,
            session_id=session_id,
        )

        if session is None:
            await websocket.send_json(
                {
                    "type": "error",
                    "message": "Chat session not found",
                }
            )

            await websocket.close()
            return

        # ==================================================
        # IMPORTANT:
        # Verify that the current user belongs to this chat
        # ==================================================

        is_participant = (
            session.user_id == user_id
            or session.recipient_id == user_id
        )

        if not is_participant:
            await websocket.send_json(
                {
                    "type": "error",
                    "message": "You are not a participant in this chat",
                }
            )

            await websocket.close()
            return

        if session.recipient_id is None:
            await websocket.send_json(
                {
                    "type": "error",
                    "message": "AI assistant chat is disabled for this session",
                }
            )
            await websocket.close()
            return

        # ==================================================
        # Register WebSocket connection
        # ==================================================

        await manager.connect(
            session_id,
            websocket,
        )

        print(
            f"User {user_id} connected to "
            f"chat session {session_id}"
        )

        # ==================================================
        # Connection confirmation
        # ==================================================

        await websocket.send_json(
            {
                "type": "connected",
                "session_id": session_id,
            }
        )

        # ==================================================
        # Receive messages
        # ==================================================

        while True:

            data = await websocket.receive_json()

            message_type = data.get(
                "type",
                "message",
            )

            if message_type != "message":
                continue

            message = data.get(
                "message",
                "",
            ).strip()

            if not message:
                continue

            user_message = (
                ChatService.save_user_message(
                    db=db,
                    session_id=session_id,
                    content=message,
                    sender_id=user_id,
                )
            )

            message_data = {
                "type": "message",
                "session_id": session_id,
                "message_id": user_message.id,
                "content": user_message.content,
                "role": "user",
                "sender_id": user_id,
                "created_at": (
                    user_message.created_at.isoformat()
                    if user_message.created_at
                    else None
                ),
            }

            # ==================================================
            # Send message to BOTH users
            # ==================================================

            await manager.broadcast(
                session_id=session_id,
                message=message_data,
            )

            print(
                f"User {user_id} sent message "
                f"in session {session_id}"
            )

    except WebSocketDisconnect:

        print(
            f"User {user_id} disconnected from "
            f"chat session {session_id}"
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
                    ),
                }
            )
        except Exception:
            pass

    finally:

        manager.disconnect(
            session_id,
            websocket,
        )

        db.close()
