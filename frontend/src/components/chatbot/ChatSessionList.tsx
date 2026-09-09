import {
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  Box,
} from "@mui/material";

import { ChatSession } from "../../api/chatApi";
import { UserOption } from "../../api/usersApi";
import UserSearch from "./UserSearch";

interface ChatSessionListProps {
  sessions: ChatSession[];
  activeSessionId: number | null;
  onSelect: (sessionId: number) => void;
  onUserSelect?: (user: UserOption) => void;
}

const ChatSessionList = ({
  sessions,
  activeSessionId,
  onSelect,
  onUserSelect,
}: ChatSessionListProps) => {
  return (
    <Box
      sx={{
        width: 260,
        borderRight: "1px solid #ddd",
        height: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ padding: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{ mb: 2 }}
        >
          Chat History
        </Typography>

        {onUserSelect && (
          <UserSearch
            onUserSelect={onUserSelect}
          />
        )}
      </Box>

      <Divider />

      <List sx={{ flex: 1, overflowY: "auto" }}>
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