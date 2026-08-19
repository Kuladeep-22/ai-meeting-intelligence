import {
  Paper,
  Typography,
} from "@mui/material";

interface Props {
  sender: "user" | "bot";
  message: string;
}

const ChatMessage = ({
  sender,
  message,
}: Props) => {
  return (
    <Paper
      sx={{
        p: 2,
        my: 1,
        maxWidth: "75%",
        ml: sender === "user" ? "auto" : 0,
        bgcolor:
          sender === "user"
            ? "#1976d2"
            : "#eeeeee",
        color:
          sender === "user"
            ? "white"
            : "black",
      }}
    >
      <Typography>
        {message}
      </Typography>
    </Paper>
  );
};

export default ChatMessage;