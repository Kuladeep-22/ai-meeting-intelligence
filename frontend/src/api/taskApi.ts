import api from "./axios";

export const taskApi = {
  getTasks: () =>
    api.get("/tasks"),

  getTaskById: (id: number) =>
    api.get(`/tasks/${id}`),

  createTask: (data: any) =>
    api.post("/tasks", data),

  updateTask: (id: number, data: any) =>
    api.put(`/tasks/${id}`, data),

  deleteTask: (id: number) =>
    api.delete(`/tasks/${id}`),

  assignTask: (id: number, userId: number) =>
    api.patch(`/tasks/${id}/assign`, {
      user_id: userId,
    }),

  updateTaskStatus: (id: number, status: string) =>
    api.patch(`/tasks/${id}/status`, {
      status,
    }),

  getMeetingTasks: (meetingId: number) =>
    api.get(`/meetings/${meetingId}/tasks`),
};