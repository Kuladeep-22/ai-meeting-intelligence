import api from "./axios";

export const riskApi = {
  getRisks: () =>
    api.get("/risks"),

  getRiskById: (id: number) =>
    api.get(`/risks/${id}`),

  createRisk: (data: any) =>
    api.post("/risks", data),

  updateRisk: (id: number, data: any) =>
    api.put(`/risks/${id}`, data),

  deleteRisk: (id: number) =>
    api.delete(`/risks/${id}`),

  getMeetingRisks: (meetingId: number) =>
    api.get(`/meetings/${meetingId}/risks`),
};