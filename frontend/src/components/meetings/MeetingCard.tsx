import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface MeetingCardProps {
  id: number;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  organizer: string;
  onView?: () => void | Promise<void>;
  onDelete?: () => void;
}

const MeetingCard = ({
  id,
  title,
  date,
  startTime,
  endTime,
  organizer,
  onView,
  onDelete,
}: MeetingCardProps) => {
  const navigate = useNavigate();

  const handleJoinMeeting = () => {
    navigate(`/meetings/${id}/room`);
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">
            {title}
          </Typography>

          <Typography color="text.secondary">
            Date: {date}
          </Typography>

          {startTime && (
            <Typography>
              Start Time: {startTime}
            </Typography>
          )}

          {endTime && (
            <Typography>
              End Time: {endTime}
            </Typography>
          )}

          <Typography>
            Organizer: {organizer}
          </Typography>

          <Chip
            label="Scheduled"
            size="small"
          />

          <Stack
            direction="row"
            spacing={1}
          >
            <Button
              variant="contained"
              onClick={handleJoinMeeting}
            >
              Join Meeting
            </Button>

            {onView && (
              <Button
                variant="outlined"
                onClick={onView}
              >
                View
              </Button>
            )}

            {onDelete && (
              <Button
                variant="outlined"
                color="error"
                onClick={onDelete}
              >
                Delete
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MeetingCard;
