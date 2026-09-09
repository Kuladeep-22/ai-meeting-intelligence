import axios from "axios";
import {
  MeetingJoinResponse,
  MeetingParticipant,
} from "../types/meetingRoom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

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