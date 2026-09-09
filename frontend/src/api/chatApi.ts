import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export interface ChatSession {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id?: number;
  session_id: number;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

export interface SendMessageRequest {
  session_id: number;
  message: string;
}

// Get all chat sessions
export const getChatSessions = async (): Promise<ChatSession[]> => {
  const response = await api.get("/chatbot/sessions");
  return response.data;
};

// Create a new chat session
export const createChatSession = async (
  title = "New Chat"
): Promise<ChatSession> => {
  const response = await api.post("/chatbot/sessions", {
    title,
  });

  return response.data;
};

// Get messages of a session
export const getChatMessages = async (
  sessionId: number
): Promise<ChatMessage[]> => {
  const response = await api.get(
    `/chatbot/sessions/${sessionId}/messages`
  );

  return response.data;
};

// Send message through REST
export const sendChatMessage = async (
  data: SendMessageRequest
): Promise<ChatMessage> => {
  const response = await api.post("/chatbot/messages", data);
  return response.data;
};

export default api;