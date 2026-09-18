import {
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

interface ChatHeaderProps {
  title?: string;
  onNewChat: () => void;
}

const ChatHeader = ({
  title = "Chats",
  onNewChat,
}: ChatHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2,
        borderBottom: "1px solid #ddd",
      }}
    >
      <Box>
        <Typography variant="h6">
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Select a user to start chatting
        </Typography>
      </Box>

      <Tooltip title="New Chat">
        <IconButton
          color="primary"
          onClick={onNewChat}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ChatHeader;