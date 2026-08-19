import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

interface HistoryItem {
  version: string;
  decision: string;
  date: string;
}

const defaultHistory: HistoryItem[] = [
  {
    version: "Version 1",
    decision: "Release in September",
    date: "10 Aug 2026",
  },
  {
    version: "Version 2",
    decision: "Release in October",
    date: "18 Aug 2026",
  },
  {
    version: "Version 3",
    decision: "Release in November",
    date: "28 Aug 2026",
  },
];

interface DecisionHistoryProps {
  history?: HistoryItem[];
}

const DecisionHistory = ({ history = defaultHistory }: DecisionHistoryProps) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
      >
        Decision History
      </Typography>

      <List>
        {history.map((item) => (
          <ListItem key={item.version}>
            <ListItemText
              primary={`${item.version} - ${item.decision}`}
              secondary={item.date}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default DecisionHistory;