import api from "./axios";
import {
  MeetingJoinResponse,
  MeetingParticipant,
} from "../types/meetingRoom";

export const joinMeeting = async (
  meetingId: number
): Promise<MeetingJoinResponse> => {
  const response = await api.post(`/meetings/${meetingId}/join`);

  return response.data;
};

export const leaveMeeting = async (meetingId: number) => {
  const response = await api.post(`/meetings/${meetingId}/leave`);

  return response.data;
};

export const getParticipants = async (
  meetingId: number
): Promise<MeetingParticipant[]> => {
  const response = await api.get(`/meetings/${meetingId}/participants`);

  return response.data;
};

export const updateParticipantStatus = async (
  meetingId: number,
  data: {
    is_muted?: boolean;
    camera_enabled?: boolean;
  }
) => {
  const response = await api.patch(
    `/meetings/${meetingId}/participants/me`,
    data
  );

  return response.data;
};