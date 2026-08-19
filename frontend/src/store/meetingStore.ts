import { create } from "zustand";

interface Meeting {
  id: number;
  title: string;
  description?: string;
  meeting_date: string;
  start_time?: string;
  end_time?: string;
  organizer: string;
}

interface MeetingStore {
  meetings: Meeting[];

  setMeetings: (meetings: Meeting[]) => void;

  addMeeting: (meeting: Meeting) => void;

  removeMeeting: (id: number) => void;
}

export const useMeetingStore = create<MeetingStore>((set) => ({
  meetings: [],

  setMeetings: (meetings) =>
    set({
      meetings,
    }),

  addMeeting: (meeting) =>
    set((state) => ({
      meetings: [...state.meetings, meeting],
    })),

  removeMeeting: (id) =>
    set((state) => ({
      meetings: state.meetings.filter((meeting) => meeting.id !== id),
    })),
}));