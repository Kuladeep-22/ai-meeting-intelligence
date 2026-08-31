import { useState } from "react";

import {
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";

import ChatMessage from "./ChatMessage";
import { chatbotApi } from "../../api/chatbotApi";

interface Message {
  id: string;
  sender: "user" | "bot";
  message: string;
}

const ChatWindow = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      message:
        "Hello! Ask me Your Technical Doubts.",
    },
  ]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const question = input;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      message: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await chatbotApi.ask(question);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          message: response.data.answer,
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          message:
            error?.response?.data?.detail ||
            "Sorry, the AI assistant is unavailable right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="h6"
        mb={2}
      >
        AI Meeting Assistant
      </Typography>

      <Paper
        sx={{
          p: 2,
          height: 350,
          overflowY: "auto",
          mb: 2,
        }}
      >
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            sender={msg.sender}
            message={msg.message}
          />
        ))}
      </Paper>

      <Stack
        direction="row"
        spacing={2}
      >
        <TextField
          fullWidth
          placeholder="Ask something..."
          value={input}
          disabled={loading}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </Button>
      </Stack>
    </Paper>
  );
};

export default ChatWindow;