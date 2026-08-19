import { Box, Stack, Typography } from "@mui/material";
import InsightsIcon from "@mui/icons-material/Insights";

interface Props {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
        p: 2,
        background:
          "linear-gradient(135deg, #4f46e5 0%, #6366f1 45%, #0ea5e9 100%)",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <InsightsIcon sx={{ color: "white", fontSize: 36 }} />
        <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>
          AI Meeting Intelligence
        </Typography>
      </Stack>

      {children}
    </Box>
  );
};

export default AuthLayout;