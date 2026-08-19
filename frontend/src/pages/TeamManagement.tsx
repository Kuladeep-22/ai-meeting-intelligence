import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";

interface TeamMember {
  name: string;
  project: string;
}

const members: TeamMember[] = [
  { name: "Rahul", project: "AI Meeting Intelligence" },
  { name: "Anjali", project: "Customer Portal Revamp" },
  { name: "Kiran", project: "Analytics Dashboard" },
  { name: "Suresh", project: "Mobile App Launch" },
];

const TeamManagement = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>
        Team Members
      </Typography>

      <List>
        {members.map((member) => (
          <ListItem key={member.name}>
            <ListItemText
              primary={member.name}
              secondary={`Project: ${member.project}`}
            />
            <Chip label={member.project} size="small" color="primary" variant="outlined" />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default TeamManagement;