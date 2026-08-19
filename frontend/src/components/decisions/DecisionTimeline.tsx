import {
  Paper,
  Typography,
  Box,
} from "@mui/material";

const defaultDecisions: string[] = [
  "Requirement Approved",
  "Development Started",
  "Release Changed to October",
  "Final Release Approved",
];

interface DecisionTimelineProps {
  decisions?: string[];
}

const DecisionTimeline = ({ decisions = defaultDecisions }: DecisionTimelineProps) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
      >
        Decision Timeline
      </Typography>

      {decisions.map((decision) => (
        <Box
          key={decision}
          sx={{
            borderLeft: "3px solid #1976d2",
            pl: 2,
            py: 1,
            ml: 1,
          }}
        >
          <Typography>
            {decision}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

export default DecisionTimeline;