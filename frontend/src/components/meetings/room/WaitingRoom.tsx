import {
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";

interface WaitingRoomProps {
  meeting: {
    title: string;
    status: string;
  };

  onJoin: () => void;
  onCancel: () => void;
}

const WaitingRoom = ({
  meeting,
  onJoin,
  onCancel,
}: WaitingRoomProps) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack
        spacing={3}
        alignItems="center"
      >
        <Typography variant="h4">
          {meeting.title}
        </Typography>

        <Typography color="text.secondary">
          Meeting status: {meeting.status}
        </Typography>

        <Typography>
          Ready to join the meeting?
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={onJoin}
          >
            Join Meeting
          </Button>

          <Button
            variant="outlined"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default WaitingRoom;