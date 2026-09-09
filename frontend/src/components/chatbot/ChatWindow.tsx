import { useState, useRef, useEffect } from "react";

import {
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  Alert,
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
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      message:
        "Hello! Ask me your technical doubts or questions about the meeting.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const question = input;
    setError(null);

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

      const answer =
        response.data?.answer ||
        "No response from AI assistant";

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          message: answer,
        },
      ]);
    } catch (error: any) {
      console.error("Chatbot error:", error);

      let errorMessage =
        "Sorry, the AI assistant is unavailable right now.";

      if (error?.response?.status === 401) {
        errorMessage = "Session expired. Please log in again.";
      } else if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          message: errorMessage,
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        sx={{
          p: 2,
          height: 350,
          overflowY: "auto",
          mb: 2,
          backgroundColor: "#f5f5f5",
        }}
      >
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            sender={msg.sender}
            message={msg.message}
          />
        ))}
        <div ref={messagesEndRef} />
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
            if (e.key === "Enter" && !loading) {
              handleSend();
            }
          }}
          size="small"
        />

        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading}
          sx={{ minWidth: "80px" }}
        >
          {loading ? "..." : "Send"}
        </Button>
      </Stack>
    </Paper>
  );
};

export default ChatWindow;