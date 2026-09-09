import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

interface ChatMessageProps {
  sender: "user" | "bot";
  message: string;
  senderId?: number;
  currentUserId?: number;
  senderName?: string;
}

const ChatMessage = ({
  sender,
  message,
  senderId,
  currentUserId,
  senderName,
}: ChatMessageProps) => {
  // For user-to-user messaging, check sender_id
  // For AI messaging, use sender prop
  const isCurrentUser =
    senderId !== undefined && currentUserId !== undefined
      ? senderId === currentUserId
      : sender === "user";

  const isUser = isCurrentUser;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser
          ? "flex-end"
          : "flex-start",
        marginBottom: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
          maxWidth: "70%",
        }}
      >
        {senderName && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 0.5 }}
          >
            {senderName}
          </Typography>
        )}

        <Paper
          elevation={1}
          sx={{
            padding: 1.5,
            borderRadius: 2,
            backgroundColor: isUser
              ? "#1976d2"
              : "#f5f5f5",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: isUser ? "white" : "black",
            }}
          >
            {message}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatMessage;
