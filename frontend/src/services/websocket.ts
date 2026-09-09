const WS_URL =
  import.meta.env.VITE_WS_URL ||
  "ws://localhost:8000";

export const createMeetingWebSocket = (
  meetingId: number
): WebSocket => {
  const token =
    localStorage.getItem("access_token");

  const url =
    `${WS_URL}/api/v1/ws/meetings/${meetingId}` +
    `?token=${encodeURIComponent(token || "")}`;

  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log(
      "Meeting WebSocket connected"
    );
  };

  socket.onclose = () => {
    console.log(
      "Meeting WebSocket disconnected"
    );
  };

  socket.onerror = (error) => {
    console.error(
      "Meeting WebSocket error",
      error
    );
  };

  return socket;
};