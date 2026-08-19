import api from "./axios";

export const analyticsApi = {
  getDashboard: () =>
    api.get("/analytics/dashboard"),

  getMeetingAnalytics: () =>
    api.get("/analytics/meetings"),

  getTaskAnalytics: () =>
    api.get("/analytics/tasks"),

  getDecisionAnalytics: () =>
    api.get("/analytics/decisions"),

  getRiskAnalytics: () =>
    api.get("/analytics/risks"),

  getParticipationAnalytics: () =>
    api.get("/analytics/participation"),
};