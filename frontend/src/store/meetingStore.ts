import { create } from "zustand";

import { Meeting } from "../api/meetingApi";

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