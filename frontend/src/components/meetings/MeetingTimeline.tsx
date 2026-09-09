import {
  Box,
  Typography,
  Paper,
} from "@mui/material";

interface MeetingTimelineProps {
  events?: {
    time: string;
    title: string;
    description?: string;
  }[];
}

const MeetingTimeline = ({
  events = [],
}: MeetingTimelineProps) => {
  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Meeting Timeline
      </Typography>

      {events.length === 0 && (
        <Typography color="text.secondary">
          No timeline events available.
        </Typography>
      )}

      {events.map((event, index) => (
        <Paper
          key={index}
          sx={{
            p: 2,
            mb: 2,
          }}
        >
          <Typography variant="subtitle1">
            {event.title}
          </Typography>

          <Typography variant="caption">
            {event.time}
          </Typography>

          {event.description && (
            <Typography color="text.secondary">
              {event.description}
            </Typography>
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default MeetingTimeline;