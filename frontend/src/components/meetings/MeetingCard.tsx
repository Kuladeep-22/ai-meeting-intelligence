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
  meeting: {
    id: number;
    title: string;
    description?: string;
    start_time?: string;
    status?: string;
  };
}

const MeetingCard = ({ meeting }: MeetingCardProps) => {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate(`/meetings/${meeting.id}/room`);
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">
            {meeting.title}
          </Typography>

          {meeting.description && (
            <Typography color="text.secondary">
              {meeting.description}
            </Typography>
          )}

          {meeting.start_time && (
            <Typography>
              {new Date(meeting.start_time).toLocaleString()}
            </Typography>
          )}

          <Chip
            label={meeting.status || "scheduled"}
            size="small"
          />

          <Button
            variant="contained"
            onClick={handleJoin}
          >
            Join Meeting
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MeetingCard;