import {
  useCallback,
  useEffect,
  useRef,
} from "react";

import {
  getChatMessages,
  getChatSessions,
  createChatSession,
  ChatMessage,
  ChatSession,
} from "../api/chatApi";

import { UserOption } from "../api/usersApi";

import {
  useChatStore,
} from "../store/chatStore";

import { useAuthStore } from "../store/authStore";

import {
  ChatWebSocket,
  WebSocketMessage,
} from "../utils/websocket";

// Only keep direct (user-to-user) chats; drop generic AI-assistant sessions
const filterDirectSessions = (
  sessions: ChatSession[]
) =>
  sessions.filter(
    (session) =>
      session.recipient_id !== undefined &&
      session.recipient_id !== null
  );

export const useChat = () => {
  const {
    sessions,
    messages,
    activeSessionId,
    isTyping,
    isConnected,

    setSessions,
    setMessages,
    addMessage,
    setActiveSession,
    setTyping,
    setConnected,
    clearMessages,
  } = useChatStore();

  const websocketRef =
    useRef<ChatWebSocket | null>(null);

  // Load sessions
  const loadSessions = useCallback(
    async () => {
      try {
        const data =
          filterDirectSessions(
            await getChatSessions()
          );

        setSessions(data);

        if (
          data.length > 0 &&
          activeSessionId === null
        ) {
          setActiveSession(data[0].id);
        }
      } catch (error) {
        console.error(
          "Failed to load chat sessions",
          error
        );
      }
    },
    [
      activeSessionId,
      setSessions,
      setActiveSession,
    ]
  );

  // Load messages
  const loadMessages = useCallback(
    async (sessionId: number) => {
      try {
        const data =
          await getChatMessages(
            sessionId
          );

        setMessages(data);
      } catch (error) {
        console.error(
          "Failed to load messages",
          error
        );
      }
    },
    [setMessages]
  );

  // Connect WebSocket
  const connectWebSocket = useCallback(
    (sessionId: number) => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }

      const ws =
        new ChatWebSocket(sessionId);

      websocketRef.current = ws;

      ws.connect(
        (data: WebSocketMessage) => {
          if (data.type === "typing") {
            setTyping(
              Boolean(data.content)
            );

            return;
          }

          if (
            data.type === "assistant_message"
          ) {
            const assistantMessage: ChatMessage =
              {
                id: data.message_id,
                session_id: sessionId,
                role: "assistant",
                content:
                  data.content || "",
              };

            addMessage(
              assistantMessage
            );

            setTyping(false);

            return;
          }

          if (
            data.type === "message"
          ) {
            const incomingMessage: ChatMessage =
              {
                id: data.message_id,
                session_id: sessionId,
                sender_id: data.sender_id,
                role:
                  data.role ===
                  "assistant"
                    ? "assistant"
                    : "user",
                content:
                  data.content ||
                  data.message ||
                  "",
                created_at: data.created_at,
              };

            addMessage(
              incomingMessage
            );

            setTyping(false);
          }
        },

        () => {
          setConnected(true);
        },

        () => {
          setConnected(false);
        },

        () => {
          setConnected(false);
        }
      );
    },
    [
      addMessage,
      setConnected,
      setTyping,
    ]
  );

  // Select session
  const selectSession = useCallback(
    async (sessionId: number) => {
      setActiveSession(sessionId);

      await loadMessages(
        sessionId
      );

      connectWebSocket(sessionId);
    },
    [
      setActiveSession,
      loadMessages,
      connectWebSocket,
    ]
  );

  // Create new session with a specific user
  const createChatWithUser =
    useCallback(
      async (user: UserOption) => {
        try {
          console.log(
            "Opening chat with:",
            user.full_name,
            user.id
          );

          const session =
            await createChatSession(
              `Chat with ${user.full_name}`,
              user.id
            );

            console.log(
              "Chat session:",
              session
            );

            const updatedSessions =
              filterDirectSessions(
                await getChatSessions()
              );

          setSessions(updatedSessions);

          clearMessages();

          setActiveSession(
            session.id
          );

          console.log(
            `Opened chat with user: ${user.full_name} (ID: ${user.id})`
          );
        } catch (error) {
          console.error(
            "Failed to create/open chat with user",
            error
          );

          throw error;
        }
      },
      [
        setSessions,
        clearMessages,
        setActiveSession,
      ]
    );

  // Send message
  const sendMessage = useCallback(
    (message: string) => {
      const currentUser =
        useAuthStore.getState().user;

      if (
        !activeSessionId ||
        !websocketRef.current
      ) {
        console.error(
          "No active chat session"
        );

        return;
      }

      const userMessage: ChatMessage = {
        session_id:
          activeSessionId,
        sender_id:
          currentUser?.id,
        role: "user",
        content: message,
      };

      // Immediately display user message
      addMessage(userMessage);

      setTyping(true);

      // Send through WebSocket
      websocketRef.current.send(
        message
      );
    },
    [
      activeSessionId,
      addMessage,
      setTyping,
    ]
  );

  // Load sessions initially, then keep polling so incoming
  // chats from other users show up without a manual refresh
  useEffect(() => {
    loadSessions();

    const pollId = setInterval(() => {
      loadSessions();
    }, 5000);

    return () => {
      clearInterval(pollId);

      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [loadSessions]);

  // Connect when active session changes
  useEffect(() => {
    if (activeSessionId) {
      loadMessages(
        activeSessionId
      );

      connectWebSocket(
        activeSessionId
      );
    }
  }, [
    activeSessionId,
    loadMessages,
    connectWebSocket,
  ]);

  return {
    sessions,
    messages,
    activeSessionId,
    isTyping,
    isConnected,

    sendMessage,
    selectSession,
    createChatWithUser,
  };
};

export default useChat;