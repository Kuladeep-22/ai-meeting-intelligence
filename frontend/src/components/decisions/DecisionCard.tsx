import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
} from "@mui/material";

interface DecisionCardProps {
  title: string;
  owner: string;
  status: string;
  date: string;
  onView: () => void;
}

const DecisionCard = ({
  title,
  owner,
  status,
  date,
  onView,
}: DecisionCardProps) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">
          {title}
        </Typography>

        <Typography color="text.secondary">
          Owner: {owner}
        </Typography>

        <Typography color="text.secondary">
          Date: {date}
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Chip
            label={status}
            color={status === "Approved" ? "success" : "warning"}
          />

          <Button
            variant="contained"
            onClick={onView}
          >
            View
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DecisionCard;