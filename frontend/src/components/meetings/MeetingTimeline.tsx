import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import { TimelineEvent, buildMeetingTimeline } from "../../utils/meetingTime";

const defaultEvents: TimelineEvent[] = buildMeetingTimeline("10:00", "11:00");

interface MeetingTimelineProps {
  events?: TimelineEvent[];
}

const MeetingTimeline = ({ events = defaultEvents }: MeetingTimelineProps) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
      >
        Meeting Timeline
      </Typography>

      <List>
        {events.map((item) => (
          <ListItem key={`${item.time}-${item.event}`}>
            <ListItemText
              primary={item.event}
              secondary={item.time}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default MeetingTimeline;