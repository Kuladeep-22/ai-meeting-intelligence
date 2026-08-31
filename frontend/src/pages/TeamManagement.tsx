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
  { name: "Rahul", project: "Front-End Development" },
  { name: "Anjali", project: "Back-End Development" },
  { name: "Kiran", project: "Database Implementation" },
  { name: "Suresh", project: "AI Implementation" },
  { name: "Priya", project: "UI/UX Design" },
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
            />
            <Chip label={member.project} size="small" color="primary" variant="outlined" />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default TeamManagement;