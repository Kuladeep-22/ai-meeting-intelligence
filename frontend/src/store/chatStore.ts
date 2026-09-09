import { create } from "zustand";
import {
  ChatMessage,
  ChatSession,
} from "../api/chatApi";

interface ChatState {
  sessions: ChatSession[];
  messages: ChatMessage[];
  activeSessionId: number | null;
  isTyping: boolean;
  isConnected: boolean;

  setSessions: (sessions: ChatSession[]) => void;

  setMessages: (messages: ChatMessage[]) => void;

  addMessage: (message: ChatMessage) => void;

  setActiveSession: (sessionId: number | null) => void;

  setTyping: (typing: boolean) => void;

  setConnected: (connected: boolean) => void;

  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  sessions: [],
  messages: [],
  activeSessionId: null,
  isTyping: false,
  isConnected: false,

  setSessions: (sessions) =>
    set({
      sessions,
    }),

  setMessages: (messages) =>
    set({
      messages,
    }),

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        message,
      ],
    })),

  setActiveSession: (sessionId) =>
    set({
      activeSessionId: sessionId,
    }),

  setTyping: (typing) =>
    set({
      isTyping: typing,
    }),

  setConnected: (connected) =>
    set({
      isConnected: connected,
    }),

  clearMessages: () =>
    set({
      messages: [],
    }),
}));