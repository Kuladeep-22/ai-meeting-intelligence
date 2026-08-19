import api from "./axios";

export const meetingApi = {
  getMeetings: () =>
    api.get("/meetings"),

  getMyMeetings: () =>
    api.get("/meetings/mine"),

  getMeetingById: (id: number) =>
    api.get(`/meetings/${id}`),

  createMeeting: (data: any) =>
    api.post("/meetings", data),

  updateMeeting: (id: number, data: any) =>
    api.put(`/meetings/${id}`, data),

  rsvp: (id: number, status: "accepted" | "declined" | "tentative") =>
    api.patch(`/meetings/${id}/rsvp`, { status }),

  deleteMeeting: (id: number) =>
    api.delete(`/meetings/${id}`),

  uploadTranscript: (id: number, formData: FormData) =>
    api.post(`/meetings/${id}/transcript`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  uploadAudio: (id: number, formData: FormData) =>
    api.post(`/meetings/${id}/audio`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  analyzeMeeting: (id: number) =>
    api.post(`/meetings/${id}/analyze`),
};