import {
  Box,
  Typography,
} from "@mui/material";

interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
}

const ChatHeader = ({
  title = "Chats",
  subtitle,
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

        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChatHeader;