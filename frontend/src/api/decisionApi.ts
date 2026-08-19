import api from "./axios";

export const decisionApi = {
  getAllDecisions: () =>
    api.get("/decisions"),

  getDecision: (id: number) =>
    api.get(`/decisions/${id}`),

  getMeetingDecisions: (meetingId: number) =>
    api.get(`/meetings/${meetingId}/decisions`),

  createDecision: (data: any) =>
    api.post("/decisions", data),

  updateDecision: (id: number, data: any) =>
    api.put(`/decisions/${id}`, data),

  deleteDecision: (id: number) =>
    api.delete(`/decisions/${id}`),

  getDecisionHistory: (id: number) =>
    api.get(`/decisions/${id}/history`),
};