export interface WebSocketMessage {
  type: string;
  session_id?: number;
  message_id?: number;
  message?: string;
  content?: string;
  role?: "user" | "assistant";
  sender_id?: number;
  created_at?: string;
}

export class ChatWebSocket {
  private socket: WebSocket | null = null;

  private url: string;

  constructor(sessionId: number) {
    // Always derive the socket host from the REST API host rather
    // than a separate VITE_WS_URL env var: the two must point at the
    // same backend, and a stale/misconfigured VITE_WS_URL has broken
    // chat delivery before.
    const apiUrl =
      import.meta.env.VITE_API_URL ||
      "https://ai-meeting-api-z144.onrender.com/api/v1";

    const wsUrl = apiUrl
      .replace(/^http/, "ws")
      .replace(/\/api\/v1\/?$/, "");

    const token = localStorage.getItem(
      "access_token"
    );

    let urlWithParams =
      `${wsUrl}/api/v1/chatbot/ws/${sessionId}`;

    if (token) {
      urlWithParams += `?token=${encodeURIComponent(token)}`;
    }

    this.url = urlWithParams;
  }

  connect(
    onMessage: (data: WebSocketMessage) => void,
    onOpen?: () => void,
    onClose?: () => void,
    onError?: () => void
  ) {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("Chat WebSocket connected");

      if (onOpen) {
        onOpen();
      }
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        onMessage(data);
      } catch (error) {
        console.error(
          "Invalid WebSocket message",
          error
        );
      }
    };

    this.socket.onclose = () => {
      console.log(
        "Chat WebSocket disconnected"
      );

      if (onClose) {
        onClose();
      }
    };

    this.socket.onerror = () => {
      console.error(
        "Chat WebSocket error"
      );

      if (onError) {
        onError();
      }
    };
  }

  send(message: string) {
    if (
      this.socket &&
      this.socket.readyState === WebSocket.OPEN
    ) {
      this.socket.send(
        JSON.stringify({
          type: "message",
          message,
        })
      );
    } else {
      console.error(
        "WebSocket is not connected"
      );
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}