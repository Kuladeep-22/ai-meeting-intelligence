import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { useEffect, useRef, useState } from "react";

import type { ChatContact, ChatMessageItem } from "../../types/chat";

interface Props {
  contact: ChatContact;
  messages: ChatMessageItem[];
  onSend: (text: string) => Promise<void>;
  sending?: boolean;
}

const ChatThread = ({ contact, messages, onSend, sending = false }: Props) => {
  const [input, setInput] = useState("");
  const [inCall, setInCall] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!inCall) return;

    const timer = window.setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [inCall]);

  useEffect(() => {
    setInCall(false);
    setCallSeconds(0);
  }, [contact.id]);

  const handleSend = async () => {
    if (!input.trim()) return;

    await onSend(input.trim());
    setInput("");
  };

  const formatDuration = (totalSeconds: number) => {
    const min = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (totalSeconds % 60)
      .toString()
      .padStart(2, "0");

    return `${min}:${sec}`;
  };

  const handleCall = () => {
    if (inCall) {
      setInCall(false);
      setCallSeconds(0);
      return;
    }

    setInCall(true);

    if (contact.phone) {
      const phoneHref = `tel:${contact.phone.replace(/[^+\d]/g, "")}`;
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isMobile) {
        window.open(phoneHref, "_self");
      }
    }
  };

  return (
    <Paper sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, borderBottom: "1px solid #e0e0e0" }}>
        <Avatar>{contact.name.charAt(0)}</Avatar>
        <Box>
          <Typography variant="subtitle1">{contact.name}</Typography>
          <Typography variant="caption" color={contact.online ? "success.main" : "text.secondary"}>
            {contact.online ? "Online" : "Offline"}
          </Typography>
        </Box>

        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
          {inCall && (
            <Chip
              color="success"
              size="small"
              label={`On call ${formatDuration(callSeconds)}`}
            />
          )}

          <Tooltip title={inCall ? "End Call" : `Call ${contact.name}`}>
            <IconButton
              size="small"
              color={inCall ? "error" : "success"}
              onClick={handleCall}
            >
              {inCall ? <CallEndIcon fontSize="small" /> : <CallIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, bgcolor: "#f5f5f5" }}>
        {messages.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No messages yet. Start the conversation.
          </Typography>
        )}

        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent: msg.sender === "me" ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Paper
              sx={{
                p: 1.5,
                maxWidth: "70%",
                bgcolor: msg.sender === "me" ? "#1976d2" : "white",
                color: msg.sender === "me" ? "white" : "black",
              }}
            >
              <Typography variant="body2">{msg.text}</Typography>
              <Typography
                variant="caption"
                sx={{ display: "block", mt: 0.5, opacity: 0.7 }}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={bottomRef} />
      </Box>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          p: 2,
          borderTop: "1px solid #e0e0e0",
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder={`Message ${contact.name}`}
          value={input}
          disabled={sending}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              void handleSend();
            }
          }}
        />

        <IconButton color="primary" onClick={() => void handleSend()} disabled={sending}>
          <SendIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
};

export default ChatThread;
