import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import { MeetingMessage } from "../../../types/meetingRoom";

interface MeetingChatProps {
  messages: MeetingMessage[];
  onSend: (message: string) => void;
}

const MeetingChat = ({
  messages,
  onSend,
}: MeetingChatProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const value = message.trim();

    if (!value) {
      return;
    }

    onSend(value);
    setMessage("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: 400,
      }}
    >
      <Typography
        variant="h6"
        sx={{ p: 2 }}
      >
        Meeting Chat
      </Typography>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
        }}
      >
        {messages.map((item, index) => (
          <Box key={item.id || index} mb={2}>
            <Typography variant="caption">
              {item.user_name}
            </Typography>

            <Typography>
              {item.message}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          p: 1,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />

        <IconButton
          onClick={handleSend}
          sx={{ color: "white" }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MeetingChat;