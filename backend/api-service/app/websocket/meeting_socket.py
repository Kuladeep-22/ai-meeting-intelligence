from __future__ import annotations

from typing import Dict

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from jose import jwt, JWTError

from app.core.config import settings
from app.services.meeting_room_service import meeting_room_service


router = APIRouter()


class MeetingConnectionManager:
    """
    WebSocket signaling manager for WebRTC meetings.

    Important:
    This server does NOT carry video/audio.

    It only exchanges:
    - participant information
    - WebRTC offers
    - WebRTC answers
    - ICE candidates
    - leave events
    """

    def __init__(self):
        # meeting_id -> user_id -> websocket
        self.rooms: Dict[str, Dict[str, WebSocket]] = {}

        # meeting_id -> user_id -> participant metadata
        self.participants: Dict[str, Dict[str, dict]] = {}

    async def connect(
        self,
        meeting_id: str,
        user_id: str,
        websocket: WebSocket,
        user_name: str,
    ):
        meeting_id = str(meeting_id)
        user_id = str(user_id)

        if meeting_id not in self.rooms:
            self.rooms[meeting_id] = {}

        if meeting_id not in self.participants:
            self.participants[meeting_id] = {}

        self.rooms[meeting_id][user_id] = websocket

        self.participants[meeting_id][user_id] = {
            "user_id": int(user_id),
            "user_name": user_name,
        }

    def disconnect(
        self,
        meeting_id: str,
        user_id: str,
    ):
        meeting_id = str(meeting_id)
        user_id = str(user_id)

        room = self.rooms.get(meeting_id)

        if room:
            room.pop(user_id, None)

            if not room:
                self.rooms.pop(meeting_id, None)

        participants = self.participants.get(meeting_id)

        if participants:
            participants.pop(user_id, None)

            if not participants:
                self.participants.pop(meeting_id, None)

    async def send_to_user(
        self,
        meeting_id: str,
        user_id: str,
        message: dict,
    ):
        websocket = (
            self.rooms
            .get(str(meeting_id), {})
            .get(str(user_id))
        )

        if websocket:
            try:
                await websocket.send_json(message)
            except Exception:
                pass

    async def broadcast(
        self,
        meeting_id: str,
        message: dict,
        exclude_user_id: str | None = None,
    ):
        room = self.rooms.get(str(meeting_id), {})

        disconnected = []

        for user_id, websocket in list(room.items()):

            if (
                exclude_user_id is not None
                and str(user_id) == str(exclude_user_id)
            ):
                continue

            try:
                await websocket.send_json(message)

            except Exception:
                disconnected.append(user_id)

        for user_id in disconnected:
            self.disconnect(
                meeting_id,
                user_id,
            )

    def get_users(
        self,
        meeting_id: str,
        exclude_user_id: str | None = None,
    ):
        room = self.participants.get(
            str(meeting_id),
            {},
        )

        users = []

        for user_id, participant in room.items():

            if (
                exclude_user_id is not None
                and str(user_id) == str(exclude_user_id)
            ):
                continue

            users.append(participant)

        return users


meeting_manager = MeetingConnectionManager()


@router.websocket(
    "/ws/meetings/{meeting_id}"
)
async def meeting_websocket(
    websocket: WebSocket,
    meeting_id: int,
    token: str = Query(None),
    user_name: str = Query("Guest"),
):
    """
    WebRTC signaling WebSocket.

    URL:

    /api/v1/ws/meetings/{meeting_id}?token=...
    """

    await websocket.accept()

    user_id = None

    # ==========================================================
    # AUTHENTICATION
    # ==========================================================

    if not token:
        await websocket.send_json(
            {
                "type": "error",
                "message": "Authentication token required",
            }
        )

        await websocket.close(code=1008)
        return

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        subject = payload.get("sub")

        if subject is None:
            raise ValueError("Missing user ID")

        user_id = int(subject)

    except (
        JWTError,
        TypeError,
        ValueError,
    ) as exc:

        print(
            f"Meeting WebSocket authentication failed: {exc}"
        )

        await websocket.send_json(
            {
                "type": "error",
                "message": "Invalid authentication token",
            }
        )

        await websocket.close(code=1008)
        return

    meeting_id_str = str(meeting_id)
    user_id_str = str(user_id)

    # ==========================================================
    # CONNECT USER
    # ==========================================================

    try:

        # Create/get room
        room = meeting_room_service.get_or_create_room(
            meeting_id=meeting_id_str,
            host_user_id=user_id_str,
        )

        # Register participant
        join_result = meeting_room_service.join_room(
            meeting_id=meeting_id_str,
            user_id=user_id_str,
            user_name=user_name,
            is_host=(
                room.get("host_user_id") == user_id_str
                or not room.get("host_user_id")
            ),
        )

        await meeting_manager.connect(
            meeting_id=meeting_id_str,
            user_id=user_id_str,
            websocket=websocket,
            user_name=user_name,
        )

        print(
            f"User {user_id} connected to meeting "
            f"{meeting_id}"
        )

        # ======================================================
        # SEND CONNECTED
        # ======================================================

        await websocket.send_json(
            {
                "type": "connected",
                "meeting_id": meeting_id,
                "user_id": user_id,
                "user_name": user_name,
            }
        )

        # ======================================================
        # SEND CURRENT PARTICIPANTS
        #
        # The new user needs these users to create offers.
        # ======================================================

        existing_users = meeting_manager.get_users(
            meeting_id=meeting_id_str,
            exclude_user_id=user_id_str,
        )

        await websocket.send_json(
            {
                "type": "existing_participants",
                "participants": existing_users,
            }
        )

        # ======================================================
        # INFORM EXISTING USERS THAT A NEW USER JOINED
        # ======================================================

        await meeting_manager.broadcast(
            meeting_id=meeting_id_str,
            exclude_user_id=user_id_str,
            message={
                "type": "participant_joined",
                "participant": {
                    "user_id": user_id,
                    "user_name": user_name,
                },
            },
        )

        # ======================================================
        # MESSAGE LOOP
        # ======================================================

        while True:

            data = await websocket.receive_json()

            message_type = data.get("type")

            # --------------------------------------------------
            # WEBRTC OFFER
            # --------------------------------------------------

            if message_type == "offer":

                target_user_id = data.get(
                    "target_user_id"
                )

                if target_user_id is None:
                    continue

                await meeting_manager.send_to_user(
                    meeting_id=meeting_id_str,
                    user_id=str(target_user_id),
                    message={
                        "type": "offer",
                        "from_user_id": user_id,
                        "from_user_name": user_name,
                        "offer": data.get("offer"),
                    },
                )

            # --------------------------------------------------
            # WEBRTC ANSWER
            # --------------------------------------------------

            elif message_type == "answer":

                target_user_id = data.get(
                    "target_user_id"
                )

                if target_user_id is None:
                    continue

                await meeting_manager.send_to_user(
                    meeting_id=meeting_id_str,
                    user_id=str(target_user_id),
                    message={
                        "type": "answer",
                        "from_user_id": user_id,
                        "answer": data.get("answer"),
                    },
                )

            # --------------------------------------------------
            # ICE CANDIDATE
            # --------------------------------------------------

            elif message_type == "ice_candidate":

                target_user_id = data.get(
                    "target_user_id"
                )

                if target_user_id is None:
                    continue

                await meeting_manager.send_to_user(
                    meeting_id=meeting_id_str,
                    user_id=str(target_user_id),
                    message={
                        "type": "ice_candidate",
                        "from_user_id": user_id,
                        "candidate": data.get("candidate"),
                    },
                )

            # --------------------------------------------------
            # MEDIA STATE
            # --------------------------------------------------

            elif message_type == "media_state":

                audio_enabled = data.get(
                    "audio_enabled"
                )

                video_enabled = data.get(
                    "video_enabled"
                )

                screen_sharing = data.get(
                    "screen_sharing"
                )

                try:
                    result = (
                        meeting_room_service
                        .update_media_state(
                            meeting_id=meeting_id_str,
                            user_id=user_id_str,
                            audio_enabled=audio_enabled,
                            video_enabled=video_enabled,
                            screen_sharing=screen_sharing,
                        )
                    )

                    await meeting_manager.broadcast(
                        meeting_id=meeting_id_str,
                        exclude_user_id=user_id_str,
                        message={
                            "type": "media_state",
                            "participant": result[
                                "participant"
                            ],
                        },
                    )

                except Exception as exc:
                    print(
                        f"Media state update failed: {exc}"
                    )

            # --------------------------------------------------
            # PING
            # --------------------------------------------------

            elif message_type == "ping":

                await websocket.send_json(
                    {
                        "type": "pong"
                    }
                )

    except WebSocketDisconnect:

        print(
            f"User {user_id} disconnected from meeting "
            f"{meeting_id}"
        )

    except Exception as exc:

        print(
            f"Meeting WebSocket error: {exc}"
        )

    finally:

        if user_id is not None:

            meeting_manager.disconnect(
                meeting_id=meeting_id_str,
                user_id=user_id_str,
            )

            try:
                meeting_room_service.leave_room(
                    meeting_id=meeting_id_str,
                    user_id=user_id_str,
                )
            except Exception:
                pass

            await meeting_manager.broadcast(
                meeting_id=meeting_id_str,
                message={
                    "type": "participant_left",
                    "user_id": user_id,
                },
            )
            