import {
  Box,
  Typography,
  Chip,
} from "@mui/material";

import ChatHeader from "../components/chatbot/ChatHeader";
import ChatInput from "../components/chatbot/ChatInput";
import ChatMessage from "../components/chatbot/ChatMessage";
import ChatSessionList from "../components/chatbot/ChatSessionList";
import TypingIndicator from "../components/chatbot/TypingIndicator";
import { UserOption } from "../api/usersApi";
import { useAuthStore } from "../store/authStore";

import useChat from "../hooks/useChat";

const Chat = () => {
  const {
    sessions,
    messages,
    activeSessionId,
    isTyping,
    isConnected,

    sendMessage,
    selectSession,
    createChatWithUser,
  } = useChat();

  const currentUser = useAuthStore(
    (state) => state.user
  );

  const handleUserSelect = async (
    user: UserOption
  ) => {
    await createChatWithUser(user);
  };

  // Get current session
  const currentSession = sessions.find(
    (s) => s.id === activeSessionId
  );

  // Extract other user's name from title for 1-on-1 chats
  // Title format: "Chat with [User Name]"
  const getOtherUserName = () => {
    if (!currentSession) return "";

    const match = currentSession.title.match(
      /^Chat with (.+)$/
    );

    return match ? match[1] : "";
  };

  const otherUserName = getOtherUserName();

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 64px)",
      }}
    >
      {/* Session list */}

      <ChatSessionList
        sessions={sessions}
        activeSessionId={
          activeSessionId
        }
        onSelect={selectSession}
        onUserSelect={handleUserSelect}
      />

      {/* Chat area */}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!currentSession ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography color="text.secondary">
              Select a user on the left to start chatting
            </Typography>
          </Box>
        ) : (
          <>
            <ChatHeader
              title={
                otherUserName || "Direct Message"
              }
            />

            {/* Connection status */}

            <Box sx={{ padding: 1 }}>
              <Chip
                size="small"
                label={
                  isConnected
                    ? "Connected"
                    : "Disconnected"
                }
                color={
                  isConnected
                    ? "success"
                    : "default"
                }
              />
            </Box>

            {/* Messages */}

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                padding: 2,
              }}
            >
              {messages.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Typography
                    color="text.secondary"
                  >
                    {`Start a conversation with ${otherUserName}`}
                  </Typography>
                </Box>
              ) : (
                messages.map(
                  (message, index) => (
                    <ChatMessage
                      key={
                        message.id ??
                        `${message.role}-${index}`
                      }
                      sender={
                        message.role === "assistant"
                          ? "bot"
                          : "user"
                      }
                      message={message.content}
                      senderId={message.sender_id}
                      currentUserId={currentUser?.id}
                      senderName={
                        message.sender_id !==
                        currentUser?.id
                          ? otherUserName
                          : undefined
                      }
                    />
                  )
                )
              )}

              {isTyping && (
                <TypingIndicator />
              )}
            </Box>

            {/* Input */}

            <Box
              sx={{
                padding: 2,
                borderTop:
                  "1px solid #ddd",
              }}
            >
              <ChatInput
                onSend={sendMessage}
                disabled={
                  !activeSessionId ||
                  !isConnected
                }
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Chat;