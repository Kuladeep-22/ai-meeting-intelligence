import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface MeetingCardProps {
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  organizer: string;
  onView: () => void;
  onDelete?: () => void;
}

const MeetingCard = ({
  title,
  date,
  startTime,
  endTime,
  organizer,
  onView,
  onDelete,
}: MeetingCardProps) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6">
            {title}
          </Typography>

          {onDelete && (
            <IconButton
              aria-label="Delete meeting"
              color="error"
              size="small"
              onClick={onDelete}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>

        <Typography color="text.secondary">
          Date: {date}
          {(startTime || endTime) &&
            ` • ${startTime || "?"} - ${endTime || "?"}`}
        </Typography>

        <Typography color="text.secondary">
          Organizer: {organizer}
        </Typography>

        <Stack direction="row" mt={2}>
          <Button
            variant="contained"
            onClick={onView}
          >
            View Details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MeetingCard;