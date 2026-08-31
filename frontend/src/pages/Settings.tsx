import {
  Paper,
  Typography,
  FormControlLabel,
  Switch,
  Stack,
} from "@mui/material";
import { useThemeStore } from "../store/themeStore";

const Settings = () => {
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={3}>
        Settings
      </Typography>

      <Stack spacing={2}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Email Notifications"
        />

        <FormControlLabel
          control={
            <Switch
              checked={mode === "dark"}
              onChange={toggleMode}
            />
          }
          label="Dark Mode"
        />

        {/* <FormControlLabel
          control={<Switch defaultChecked />}
          label="AI Suggestions"
        /> */}
      </Stack>
    </Paper>
  );
};

export default Settings;