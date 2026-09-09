import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";

import { MeetingParticipant } from "../../../types/meetingRoom";

interface ParticipantListProps {
  participants: MeetingParticipant[];
}

const ParticipantList = ({
  participants,
}: ParticipantListProps) => {
  return (
    <Box p={2}>
      <Typography variant="h6">
        Participants ({participants.length})
      </Typography>

      <List>
        {participants.map((participant) => (
          <ListItem key={participant.id}>
            <ListItemText
              primary={participant.full_name}
              secondary={
                participant.is_muted
                  ? "Muted"
                  : "Microphone on"
              }
            />

            <Chip
              label={
                participant.is_online
                  ? "Online"
                  : "Offline"
              }
              size="small"
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ParticipantList;