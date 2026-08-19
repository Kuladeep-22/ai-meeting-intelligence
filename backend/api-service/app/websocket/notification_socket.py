from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Optional

router = APIRouter()


class ConnectionManager:

    def __init__(self):
        self.active_connections = []

    async def connect(
        self,
        websocket: WebSocket,
        user_id: Optional[int] = None,
    ):
        await websocket.accept()
        self.active_connections.append((websocket, user_id))

    def disconnect(
        self,
        websocket: WebSocket
    ):
        self.active_connections = [
            conn for conn in self.active_connections
            if conn[0] is not websocket
        ]

    async def send_message(
        self,
        message: str
    ):
        for connection, _ in self.active_connections:
            await connection.send_text(message)

    async def send_to_user(
        self,
        user_id: int,
        message: str,
    ):
        for connection, conn_user_id in self.active_connections:
            if conn_user_id == user_id:
                await connection.send_text(message)


manager = ConnectionManager()


@router.websocket("/ws/notifications")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: Optional[int] = None,
):

    await manager.connect(websocket, user_id)

    try:

        while True:

            await websocket.receive_text()

    except WebSocketDisconnect:

        manager.disconnect(websocket)