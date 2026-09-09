export interface MeetingParticipant {
  id: number;
  user_id: number;
  full_name: string;
  email?: string;

  is_muted: boolean;
  camera_enabled: boolean;

  joined_at?: string;
  left_at?: string;

  is_online: boolean;
}

export interface MeetingRoom {
  meeting_id: number;
  meeting_code?: string;
  title: string;
  status: "scheduled" | "waiting" | "live" | "ended";

  organizer_id?: number;

  participants: MeetingParticipant[];
}

export interface MeetingMessage {
  id?: number;
  session_id?: number;
  meeting_id?: number;

  user_id: number;
  user_name: string;

  message: string;

  created_at: string;
}

export interface MeetingJoinResponse {
  meeting_id: number;
  meeting_code?: string;
  title: string;
  status: string;

  participant: MeetingParticipant;

  participants: MeetingParticipant[];
}

export interface WebSocketMessage {
  type: string;
  meeting_id?: number;
  user_id?: number;
  user_name?: string;

  enabled?: boolean;

  message?: string;

  data?: unknown;
}