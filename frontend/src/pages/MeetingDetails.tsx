import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Paper,
  CircularProgress,
  Box,
  Button,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import TranscriptUploader from "../components/meetings/TranscriptUploader";
import AudioUploader from "../components/meetings/AudioUploader";
import MeetingTimeline from "../components/meetings/MeetingTimeline";
import ChatWindow from "../components/chatbot/ChatWindow";
import { meetingApi } from "../api/meetingApi";
import { hasMeetingStarted, buildMeetingTimeline } from "../utils/meetingTime";
import { useAuthStore } from "../store/authStore";

interface Participant {
  id: number;
  user_id: number;
  status: string;
}

interface MeetingDetail {
  id: number;
  title: string;
  description?: string;
  meeting_date: string;
  start_time?: string;
  end_time?: string;
  organizer: string;
  join_url?: string;
  participants?: Participant[];
}

const MeetingDetails = () => {
  const { id } = useParams();
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);

  const currentUser = useAuthStore((state) => state.user);

  const loadMeeting = () => {
    if (!id) return;

    meetingApi
      .getMeetingById(Number(id))
      .then((response) => setMeeting(response.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMeeting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const myParticipant = meeting?.participants?.find(
    (p) => p.user_id === currentUser?.id
  );

  const handleRsvp = async (status: "accepted" | "declined" | "tentative") => {
    if (!meeting) return;

    setRsvpSubmitting(true);

    try {
      await meetingApi.rsvp(meeting.id, status);
      loadMeeting();
    } finally {
      setRsvpSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (notFound || !meeting) {
    return (
      <Typography color="text.secondary">
        This meeting was not found. It may have been automatically removed
        after its scheduled date passed.
      </Typography>
    );
  }

  const started = hasMeetingStarted(meeting.meeting_date, meeting.start_time);

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5">{meeting.title}</Typography>

        <Typography color="text.secondary">
          {meeting.meeting_date}
          {(meeting.start_time || meeting.end_time) &&
            ` • ${meeting.start_time || "?"} - ${meeting.end_time || "?"}`}
        </Typography>

        <Typography color="text.secondary">
          Organizer: {meeting.organizer}
        </Typography>

        {meeting.join_url && (
          <Box mt={1}>
            <Button
              variant="outlined"
              size="small"
              href={meeting.join_url}
              target="_blank"
              rel="noopener"
            >
              Join Meeting
            </Button>
          </Box>
        )}

        {myParticipant && (
          <Box mt={2}>
            <Typography variant="subtitle2">Your response:</Typography>
            <Stack direction="row" spacing={1} mt={1}>
              <Chip
                label="Accept"
                color={
                  myParticipant.status === "accepted" ? "success" : "default"
                }
                onClick={() => handleRsvp("accepted")}
                disabled={rsvpSubmitting}
                clickable
              />
              <Chip
                label="Tentative"
                color={
                  myParticipant.status === "tentative" ? "warning" : "default"
                }
                onClick={() => handleRsvp("tentative")}
                disabled={rsvpSubmitting}
                clickable
              />
              <Chip
                label="Decline"
                color={
                  myParticipant.status === "declined" ? "error" : "default"
                }
                onClick={() => handleRsvp("declined")}
                disabled={rsvpSubmitting}
                clickable
              />
            </Stack>
          </Box>
        )}

        {meeting.participants && meeting.participants.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle2">Participants</Typography>
            <List dense>
              {meeting.participants.map((p) => (
                <ListItem key={p.id} disableGutters>
                  <ListItemText
                    primary={`User #${p.user_id}`}
                    secondary={p.status}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>

      {started ? (
        <>
          <TranscriptUploader meetingId={meeting.id} />

          <br />

          <AudioUploader meetingId={meeting.id} />
        </>
      ) : (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography color="text.secondary">
            Transcript and audio uploads will open once the meeting starts
            {meeting.start_time ? ` at ${meeting.start_time}` : ""} on{" "}
            {meeting.meeting_date}.
          </Typography>
        </Paper>
      )}

      <br />

      <MeetingTimeline
        events={buildMeetingTimeline(meeting.start_time, meeting.end_time)}
      />

      <br />

      <ChatWindow />
    </>
  );
};

export default MeetingDetails;