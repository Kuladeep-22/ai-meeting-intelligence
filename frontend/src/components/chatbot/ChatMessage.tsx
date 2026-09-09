import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import { ChatMessage as ChatMessageType } from "../../api/chatApi";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({
  message,
}: ChatMessageProps) => {
  const isUser =
    message.role === "user";

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
      <Paper
        elevation={1}
        sx={{
          padding: 1.5,
          maxWidth: "70%",
          borderRadius: 2,
        }}
      >
        <Typography variant="body1">
          {message.content}
        </Typography>

        {message.created_at && (
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {new Date(
              message.created_at
            ).toLocaleTimeString()}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ChatMessage;