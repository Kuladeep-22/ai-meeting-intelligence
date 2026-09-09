export interface WebSocketMessage {
  type: string;
  session_id?: number;
  message?: string;
  content?: string;
  role?: "user" | "assistant";
}

export class ChatWebSocket {
  private socket: WebSocket | null = null;

  private url: string;

  constructor(sessionId: number) {
    const wsUrl =
      import.meta.env.VITE_WS_URL ||
      "ws://localhost:8000";

    this.url =
      `${wsUrl}/api/v1/chatbot/ws/${sessionId}`;
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