from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import UUID, uuid4

from fastapi import HTTPException, status


class MeetingRoomService:
    """
    Service responsible for managing live meeting-room state.

    This service is intentionally kept separate from the WebRTC media layer.

    WebRTC:
        Browser <-> Browser media connection

    WebSocket:
        Browser <-> FastAPI signaling/events

    PostgreSQL:
        Persistent meeting/participant information

    This service:
        - Creates/gets meeting rooms
        - Allows participants to join
        - Removes participants
        - Tracks participant presence
        - Tracks meeting status
        - Generates WebSocket events
    """

    def __init__(self) -> None:
        # In-memory active-room state.
        #
        # IMPORTANT:
        # This is suitable for local development or a single backend
        # instance. For production with multiple Render instances,
        # move this state to Redis.
        self.rooms: Dict[str, Dict[str, Any]] = {}

    # ------------------------------------------------------------------
    # Room management
    # ------------------------------------------------------------------

    def create_room(
        self,
        meeting_id: str,
        host_user_id: str,
    ) -> Dict[str, Any]:
        """
        Create a live room for a meeting.
        """

        room_id = str(uuid4())

        room = {
            "room_id": room_id,
            "meeting_id": str(meeting_id),
            "host_user_id": str(host_user_id),
            "status": "waiting",
            "created_at": self._now(),
            "started_at": None,
            "ended_at": None,
            "participants": {},
        }

        self.rooms[str(meeting_id)] = room

        return self._serialize_room(room)

    def get_room(
        self,
        meeting_id: str,
    ) -> Optional[Dict[str, Any]]:
        """
        Return an existing room.
        """

        return self.rooms.get(str(meeting_id))

    def get_or_create_room(
        self,
        meeting_id: str,
        host_user_id: str,
    ) -> Dict[str, Any]:
        """
        Get existing room or create a new one.
        """

        room = self.get_room(meeting_id)

        if room:
            return self._serialize_room(room)

        return self.create_room(
            meeting_id=meeting_id,
            host_user_id=host_user_id,
        )

    # ------------------------------------------------------------------
    # Participant management
    # ------------------------------------------------------------------

    def join_room(
        self,
        meeting_id: str,
        user_id: str,
        user_name: str,
        *,
        is_host: bool = False,
        audio_enabled: bool = True,
        video_enabled: bool = True,
    ) -> Dict[str, Any]:
        """
        Add a participant to a meeting room.
        """

        meeting_id = str(meeting_id)
        user_id = str(user_id)

        room = self.get_room(meeting_id)

        if not room:
            room = self.create_room(
                meeting_id=meeting_id,
                host_user_id=user_id if is_host else "",
            )

            room = self.rooms[meeting_id]

        # Do not create duplicate participants.
        existing = room["participants"].get(user_id)

        if existing:
            existing["connected"] = True
            existing["last_seen"] = self._now()

            return {
                "room": self._serialize_room(room),
                "participant": existing,
                "event": {
                    "type": "participant_reconnected",
                    "participant": existing,
                },
            }

        participant = {
            "participant_id": str(uuid4()),
            "user_id": user_id,
            "name": user_name,
            "is_host": is_host,
            "audio_enabled": audio_enabled,
            "video_enabled": video_enabled,
            "screen_sharing": False,
            "connected": True,
            "joined_at": self._now(),
            "last_seen": self._now(),
        }

        room["participants"][user_id] = participant

        # First participant/host can start the meeting.
        if room["status"] == "waiting":
            room["status"] = "live"
            room["started_at"] = self._now()

        return {
            "room": self._serialize_room(room),
            "participant": participant,
            "event": {
                "type": "participant_joined",
                "participant": participant,
            },
        }

    def leave_room(
        self,
        meeting_id: str,
        user_id: str,
    ) -> Dict[str, Any]:
        """
        Remove a participant from a meeting room.
        """

        meeting_id = str(meeting_id)
        user_id = str(user_id)

        room = self.get_room(meeting_id)

        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Meeting room not found",
            )

        participant = room["participants"].get(user_id)

        if not participant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Participant is not in the meeting",
            )

        participant["connected"] = False
        participant["last_seen"] = self._now()

        del room["participants"][user_id]

        # End room if nobody remains.
        if len(room["participants"]) == 0:
            room["status"] = "ended"
            room["ended_at"] = self._now()

        return {
            "room": self._serialize_room(room),
            "participant": participant,
            "event": {
                "type": "participant_left",
                "participant": participant,
            },
        }

    def get_participants(
        self,
        meeting_id: str,
    ) -> List[Dict[str, Any]]:
        """
        Return all currently connected participants.
        """

        room = self.get_room(meeting_id)

        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Meeting room not found",
            )

        return list(room["participants"].values())

    def get_participant(
        self,
        meeting_id: str,
        user_id: str,
    ) -> Optional[Dict[str, Any]]:
        """
        Get a specific participant.
        """

        room = self.get_room(meeting_id)

        if not room:
            return None

        return room["participants"].get(str(user_id))

    # ------------------------------------------------------------------
    # Participant media state
    # ------------------------------------------------------------------

    def update_media_state(
        self,
        meeting_id: str,
        user_id: str,
        *,
        audio_enabled: Optional[bool] = None,
        video_enabled: Optional[bool] = None,
        screen_sharing: Optional[bool] = None,
    ) -> Dict[str, Any]:
        """
        Update microphone, camera or screen-sharing state.
        """

        room = self.get_room(meeting_id)

        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Meeting room not found",
            )

        participant = room["participants"].get(str(user_id))

        if not participant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Participant not found",
            )

        if audio_enabled is not None:
            participant["audio_enabled"] = audio_enabled

        if video_enabled is not None:
            participant["video_enabled"] = video_enabled

        if screen_sharing is not None:
            participant["screen_sharing"] = screen_sharing

        participant["last_seen"] = self._now()

        return {
            "participant": participant,
            "event": {
                "type": "media_state_changed",
                "participant": participant,
            },
        }

    # ------------------------------------------------------------------
    # Meeting state
    # ------------------------------------------------------------------

    def start_meeting(
        self,
        meeting_id: str,
        user_id: str,
    ) -> Dict[str, Any]:
        """
        Start a meeting.

        Normally only the host should call this.
        """

        room = self.get_room(meeting_id)

        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Meeting room not found",
            )

        if room["host_user_id"] and room["host_user_id"] != str(user_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the meeting host can start the meeting",
            )

        room["status"] = "live"

        if room["started_at"] is None:
            room["started_at"] = self._now()

        return {
            "room": self._serialize_room(room),
            "event": {
                "type": "meeting_started",
                "meeting_id": meeting_id,
            },
        }

    def end_meeting(
        self,
        meeting_id: str,
        user_id: str,
    ) -> Dict[str, Any]:
        """
        End the meeting.

        Normally only the host should be allowed to do this.
        """

        room = self.get_room(meeting_id)

        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Meeting room not found",
            )

        if room["host_user_id"] and room["host_user_id"] != str(user_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the meeting host can end the meeting",
            )

        room["status"] = "ended"
        room["ended_at"] = self._now()

        return {
            "room": self._serialize_room(room),
            "event": {
                "type": "meeting_ended",
                "meeting_id": meeting_id,
            },
        }

    # ------------------------------------------------------------------
    # Connection / heartbeat
    # ------------------------------------------------------------------

    def heartbeat(
        self,
        meeting_id: str,
        user_id: str,
    ) -> Dict[str, Any]:
        """
        Update participant last-seen timestamp.
        """

        room = self.get_room(meeting_id)

        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Meeting room not found",
            )

        participant = room["participants"].get(str(user_id))

        if not participant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Participant not found",
            )

        participant["last_seen"] = self._now()

        return participant

    # ------------------------------------------------------------------
    # Room information
    # ------------------------------------------------------------------

    def get_room_info(
        self,
        meeting_id: str,
    ) -> Dict[str, Any]:
        """
        Return room information for frontend.
        """

        room = self.get_room(meeting_id)

        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Meeting room not found",
            )

        return self._serialize_room(room)

    def participant_count(
        self,
        meeting_id: str,
    ) -> int:
        """
        Return current participant count.
        """

        room = self.get_room(meeting_id)

        if not room:
            return 0

        return len(room["participants"])

    # ------------------------------------------------------------------
    # Cleanup
    # ------------------------------------------------------------------

    def cleanup_room(
        self,
        meeting_id: str,
    ) -> None:
        """
        Completely remove an ended room from memory.
        """

        meeting_id = str(meeting_id)

        room = self.rooms.get(meeting_id)

        if not room:
            return

        if room["status"] != "ended":
            return

        del self.rooms[meeting_id]

    # ------------------------------------------------------------------
    # WebSocket event helpers
    # ------------------------------------------------------------------

    def create_event(
        self,
        event_type: str,
        meeting_id: str,
        *,
        user_id: Optional[str] = None,
        data: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Create a standard WebSocket event.
        """

        return {
            "type": event_type,
            "meeting_id": str(meeting_id),
            "user_id": str(user_id) if user_id else None,
            "data": data or {},
            "timestamp": self._now(),
        }

    # ------------------------------------------------------------------
    # Serialization
    # ------------------------------------------------------------------

    def _serialize_room(
        self,
        room: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Convert internal room representation into JSON-friendly data.
        """

        return {
            "room_id": room["room_id"],
            "meeting_id": room["meeting_id"],
            "host_user_id": room["host_user_id"],
            "status": room["status"],
            "created_at": room["created_at"],
            "started_at": room["started_at"],
            "ended_at": room["ended_at"],
            "participant_count": len(room["participants"]),
            "participants": list(room["participants"].values()),
        }

    # ------------------------------------------------------------------
    # Utilities
    # ------------------------------------------------------------------

    @staticmethod
    def _now() -> str:
        """
        Return UTC timestamp as ISO string.
        """

        return datetime.now(timezone.utc).isoformat()


# Singleton service instance.
#
# Import this instance from routes/WebSocket handlers:
#
# from app.services.meeting_room_service import meeting_room_service
#
meeting_room_service = MeetingRoomService()