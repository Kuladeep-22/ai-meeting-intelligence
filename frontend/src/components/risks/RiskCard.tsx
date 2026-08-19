import {
  Card,
  CardContent,
  Typography,
  Chip,
} from "@mui/material";

interface RiskCardProps {
  title: string;
  severity: "Low" | "Medium" | "High";
  owner: string;
}

const RiskCard = ({
  title,
  severity,
  owner,
}: RiskCardProps) => {
  const color =
    severity === "High"
      ? "error"
      : severity === "Medium"
      ? "warning"
      : "success";

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">
          {title}
        </Typography>

        <Typography color="text.secondary">
          Owner: {owner}
        </Typography>

        <Chip
          label={severity}
          color={color}
          sx={{ mt: 2 }}
        />
      </CardContent>
    </Card>
  );
};

export default RiskCard;