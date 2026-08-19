import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        mt: 5,
        py: 2,
        textAlign: "center",
        borderTop: "1px solid #ddd",
      }}
    >
      <Typography variant="body2">
        © 2026 AI Meeting Intelligence Platform
      </Typography>

      <Typography variant="caption">
        Built with React + FastAPI + Flask AI
      </Typography>
    </Box>
  );
};

export default Footer;