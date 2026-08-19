import api from "./axios";

export interface ChatAskResponse {
  answer: string;
  sources?: string[];
}

export const chatbotApi = {
  ask: (question: string) =>
    api.post<ChatAskResponse>("/chatbot/ask", { question }),

  index: (docId: string, text: string) =>
    api.post("/chatbot/index", { doc_id: docId, text }),
};
