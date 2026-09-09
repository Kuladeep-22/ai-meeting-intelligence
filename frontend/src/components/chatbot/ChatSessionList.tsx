import {
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  Box,
} from "@mui/material";

import { ChatSession } from "../../api/chatApi";

interface ChatSessionListProps {
  sessions: ChatSession[];
  activeSessionId: number | null;
  onSelect: (sessionId: number) => void;
}

const ChatSessionList = ({
  sessions,
  activeSessionId,
  onSelect,
}: ChatSessionListProps) => {
  return (
    <Box
      sx={{
        width: 260,
        borderRight: "1px solid #ddd",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ padding: 2 }}
      >
        Chat History
      </Typography>

      <Divider />

      <List>
        {sessions.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ padding: 2 }}
          >
            No previous chats
          </Typography>
        ) : (
          sessions.map((session) => (
            <ListItemButton
              key={session.id}
              selected={
                session.id === activeSessionId
              }
              onClick={() =>
                onSelect(session.id)
              }
            >
              <ListItemText
                primary={session.title}
                secondary={new Date(
                  session.updated_at
                ).toLocaleDateString()}
              />
            </ListItemButton>
          ))
        )}
      </List>
    </Box>
  );
};

export default ChatSessionList;