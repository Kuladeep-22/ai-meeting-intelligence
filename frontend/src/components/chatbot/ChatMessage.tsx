import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

interface ChatMessageProps {
  sender: "user" | "bot";
  message: string;
}

const ChatMessage = ({
  sender,
  message,
}: ChatMessageProps) => {
  const isUser = sender === "user";

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
          {message}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ChatMessage;
