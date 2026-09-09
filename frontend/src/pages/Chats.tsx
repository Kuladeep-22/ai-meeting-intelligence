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
    newChat,
  } = useChat();

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
      />

      {/* Chat area */}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ChatHeader
          title="AI Meeting Assistant"
          onNewChat={newChat}
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
                Ask me anything about your
                meetings.
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
      </Box>
    </Box>
  );
};

export default Chat;