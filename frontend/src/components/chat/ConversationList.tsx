import {
  Avatar,
  Badge,
  Box,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import type { ChatContact } from "../../types/chat";

interface Props {
  contacts: ChatContact[];
  activeId: string;
  unreadCounts: Record<string, number>;
  onSelect: (id: string) => void;
}

const ConversationList = ({ contacts, activeId, unreadCounts, onSelect }: Props) => {
  const [search, setSearch] = useState("");

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Chats
        </Typography>

        <TextField
          size="small"
          fullWidth
          placeholder="Search people"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <Divider />

      <List sx={{ overflowY: "auto", flexGrow: 1 }}>
        {filtered.map((contact) => (
          <ListItemButton
            key={contact.id}
            selected={contact.id === activeId}
            onClick={() => onSelect(contact.id)}
          >
            <ListItemAvatar>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                color={contact.online ? "success" : "default"}
              >
                <Avatar>{contact.name.charAt(0)}</Avatar>
              </Badge>
            </ListItemAvatar>

            <ListItemText
              primary={contact.name}
              secondary={contact.role}
            />

            {unreadCounts[contact.id] > 0 && (
              <Badge
                badgeContent={unreadCounts[contact.id]}
                color="error"
              />
            )}
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

export default ConversationList;
