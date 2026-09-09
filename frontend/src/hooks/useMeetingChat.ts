import { useEffect, useState } from "react";

import {
  MeetingMessage,
} from "../types/meetingRoom";

import {
  createMeetingWebSocket,
} from "../services/websocket";

const useMeetingChat = (meetingId: number) => {
  const [messages, setMessages] =
    useState<MeetingMessage[]>([]);

  const [socket, setSocket] =
    useState<WebSocket | null>(null);

  useEffect(() => {
    if (!meetingId) {
      return;
    }

    const ws =
      createMeetingWebSocket(meetingId);

    setSocket(ws);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "chat_message") {
          setMessages((current) => [
            ...current,
            {
              id: data.id,
              meeting_id: meetingId,
              user_id: data.user_id,
              user_name:
                data.user_name || "User",
              message: data.message,
              created_at:
                data.created_at ||
                new Date().toISOString(),
            },
          ]);
        }
      } catch (error) {
        console.error(
          "Invalid WebSocket message",
          error
        );
      }
    };

    return () => {
      ws.close();
    };
  }, [meetingId]);

  const sendMessage = (message: string) => {
    if (!socket) {
      return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
      return;
    }

    socket.send(
      JSON.stringify({
        type: "chat_message",
        meeting_id: meetingId,
        message,
      })
    );
  };

  return {
    messages,
    sendMessage,
  };
};

export default useMeetingChat;