import {
  Box,
  Typography,
  Chip,
} from "@mui/material";

interface MeetingInfoProps {
  meeting: {
    title: string;
    meeting_code?: string;
    status: string;
  };
}

const MeetingInfo = ({
  meeting,
}: MeetingInfoProps) => {
  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#1f2937",
      }}
    >
      <Box>
        <Typography variant="h6">
          {meeting.title}
        </Typography>

        {meeting.meeting_code && (
          <Typography variant="caption">
            Meeting Code: {meeting.meeting_code}
          </Typography>
        )}
      </Box>

      <Chip
        label={meeting.status}
        color={
          meeting.status === "live"
            ? "success"
            : "default"
        }
      />
    </Box>
  );
};

export default MeetingInfo;