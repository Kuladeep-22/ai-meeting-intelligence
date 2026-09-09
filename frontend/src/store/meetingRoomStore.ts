import { create } from "zustand";

import {
  MeetingRoom,
  MeetingParticipant,
} from "../types/meetingRoom";

interface MeetingRoomState {
  room: MeetingRoom | null;

  participants: MeetingParticipant[];

  isMuted: boolean;
  cameraEnabled: boolean;

  setRoom: (room: MeetingRoom) => void;

  setParticipants: (
    participants: MeetingParticipant[]
  ) => void;

  addParticipant: (
    participant: MeetingParticipant
  ) => void;

  removeParticipant: (
    userId: number
  ) => void;

  updateParticipant: (
    userId: number,
    data: Partial<MeetingParticipant>
  ) => void;

  setMuted: (value: boolean) => void;

  setCameraEnabled: (value: boolean) => void;

  clearRoom: () => void;
}

export const useMeetingRoomStore =
  create<MeetingRoomState>((set) => ({
    room: null,

    participants: [],

    isMuted: false,

    cameraEnabled: true,

    setRoom: (room) =>
      set({
        room,
        participants: room.participants,
      }),

    setParticipants: (participants) =>
      set((state) => ({
        participants,

        room: state.room
          ? {
              ...state.room,
              participants,
            }
          : null,
      })),

    addParticipant: (participant) =>
      set((state) => ({
        participants: [
          ...state.participants,
          participant,
        ],
      })),

    removeParticipant: (userId) =>
      set((state) => ({
        participants:
          state.participants.filter(
            (participant) =>
              participant.user_id !== userId
          ),
      })),

    updateParticipant: (
      userId,
      data
    ) =>
      set((state) => ({
        participants:
          state.participants.map(
            (participant) =>
              participant.user_id === userId
                ? {
                    ...participant,
                    ...data,
                  }
                : participant
          ),
      })),

    setMuted: (value) =>
      set({
        isMuted: value,
      }),

    setCameraEnabled: (value) =>
      set({
        cameraEnabled: value,
      }),

    clearRoom: () =>
      set({
        room: null,
        participants: [],
        isMuted: false,
        cameraEnabled: true,
      }),
  }));