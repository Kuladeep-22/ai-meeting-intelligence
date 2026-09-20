import api from "./axios";

// ==================================================
// TYPES
// ==================================================

export interface Participant {
  id: number;
  user_id: number;
  status: string;
  full_name?: string;
  email?: string;
}

export interface Meeting {
  id: number;
  title: string;
  description?: string;

  meeting_date: string;

  start_time?: string;
  end_time?: string;

  organizer: string;
  location?: string;

  join_url?: string;

  participants?: Participant[];
}

export interface CreateMeetingData {
  title: string;
  description?: string;
  meeting_date: string;
  start_time?: string;
  end_time?: string;
  organizer: string;
  location?: string;
  participant_ids?: number[];
}

export type RSVPStatus =
  | "accepted"
  | "declined"
  | "tentative";

// ==================================================
// API FUNCTIONS
// ==================================================

export const getMeetings = async (): Promise<Meeting[]> => {
  const response = await api.get("/meetings");

  return response.data;
};

export const getMeeting = async (
  meetingId: number
): Promise<Meeting> => {
  const response = await api.get(
    `/meetings/${meetingId}`
  );

  return response.data;
};

export const createMeeting = async (
  data: CreateMeetingData
): Promise<Meeting> => {
  const response = await api.post(
    "/meetings",
    data
  );

  return response.data;
};

export const updateMeeting = async (
  meetingId: number,
  data: Partial<CreateMeetingData>
): Promise<Meeting> => {
  const response = await api.put(
    `/meetings/${meetingId}`,
    data
  );

  return response.data;
};

export const deleteMeeting = async (
  meetingId: number
) => {
  const response = await api.delete(
    `/meetings/${meetingId}`
  );

  return response.data;
};

export const startMeeting = async (
  meetingId: number
) => {
  const response = await api.post(
    `/meetings/${meetingId}/start`
  );

  return response.data;
};

export const endMeeting = async (
  meetingId: number
) => {
  const response = await api.post(
    `/meetings/${meetingId}/end`
  );

  return response.data;
};

// ==================================================
// RSVP
// ==================================================

export const rsvp = async (
  meetingId: number,
  status: RSVPStatus
) => {
  const response = await api.post(
    `/meetings/${meetingId}/rsvp`,
    {
      status,
    }
  );

  return response.data;
};

// ==================================================
// MEETING API OBJECT
// ==================================================

export const meetingApi = {
  getMeetings,
  getMeeting,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  startMeeting,
  endMeeting,
  rsvp,
};

export default meetingApi;
