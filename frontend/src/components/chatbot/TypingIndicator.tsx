import {
  Box,
  Typography,
} from "@mui/material";

const TypingIndicator = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        padding: 1.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
        }}
      >
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: "grey.500",
          }}
        />

        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: "grey.500",
          }}
        />

        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: "grey.500",
          }}
        />
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        AI is thinking...
      </Typography>
    </Box>
  );
};

export default TypingIndicator;