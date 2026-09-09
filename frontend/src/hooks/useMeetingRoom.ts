import { useEffect, useState } from "react";

import {
  joinMeeting,
  leaveMeeting,
  getParticipants,
  updateParticipantStatus,
} from "../api/meetingParticipantApi";

import { getMeeting } from "../api/meetingApi";

import {
  MeetingRoom,
  MeetingParticipant,
} from "../types/meetingRoom";

import { useMeetingRoomStore } from "../store/meetingRoomStore";

const useMeetingRoom = (meetingId: number) => {
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);

  const {
    room,
    setRoom,
    setParticipants,
    setMuted,
    setCameraEnabled,
    isMuted,
    cameraEnabled,
  } = useMeetingRoomStore();

  useEffect(() => {
    if (!meetingId) {
      return;
    }

    initializeMeeting();
  }, [meetingId]);

  const initializeMeeting = async () => {
    try {
      setLoading(true);

      const meeting = await getMeeting(meetingId);

      const participants =
        await getParticipants(meetingId);

      const roomData: MeetingRoom = {
        meeting_id: meeting.id,
        meeting_code: meeting.meeting_code,
        title: meeting.title,
        status:
          (meeting.status as MeetingRoom["status"]) ||
          "scheduled",
        organizer_id: meeting.organizer_id,
        participants,
      };

      setRoom(roomData);
      setParticipants(participants);

      try {
        await joinMeeting(meetingId);

        setJoined(true);
      } catch (error) {
        console.error(
          "Unable to join meeting",
          error
        );
      }
    } catch (error) {
      console.error(
        "Failed to initialize meeting",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMute = async () => {
    const newValue = !isMuted;

    setMuted(newValue);

    try {
      await updateParticipantStatus(
        meetingId,
        {
          is_muted: newValue,
        }
      );
    } catch (error) {
      console.error(
        "Failed to update microphone status",
        error
      );
    }
  };

  const toggleCamera = async () => {
    const newValue = !cameraEnabled;

    setCameraEnabled(newValue);

    try {
      await updateParticipantStatus(
        meetingId,
        {
          camera_enabled: newValue,
        }
      );
    } catch (error) {
      console.error(
        "Failed to update camera status",
        error
      );
    }
  };

  const leave = async () => {
    try {
      await leaveMeeting(meetingId);
      setJoined(false);
    } catch (error) {
      console.error(
        "Failed to leave meeting",
        error
      );
    }
  };

  return {
    room,
    loading,
    joined,
    isMuted,
    cameraEnabled,
    toggleMute,
    toggleCamera,
    leave,
  };
};

export default useMeetingRoom;