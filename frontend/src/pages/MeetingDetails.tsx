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

import {
  meetingApi,
  Meeting,
  RSVPStatus,
} from "../api/meetingApi";

import {
  hasMeetingStarted,
  buildMeetingTimeline,
} from "../utils/meetingTime";

import { useAuthStore } from "../store/authStore";

const MeetingDetails = () => {
  const { id } = useParams();

  const [meeting, setMeeting] =
    useState<Meeting | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [notFound, setNotFound] =
    useState(false);

  const [rsvpSubmitting, setRsvpSubmitting] =
    useState(false);

  const currentUser = useAuthStore(
    (state) => state.user
  );

  // ==================================================
  // LOAD MEETING
  // ==================================================

  const loadMeeting = async () => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setNotFound(false);

      const response =
        await meetingApi.getMeeting(
          Number(id)
        );

      setMeeting(response);
    } catch (error) {
      console.error(
        "Failed to load meeting:",
        error
      );

      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeeting();
  }, [id]);

  // ==================================================
  // CURRENT USER PARTICIPANT
  // ==================================================

  const myParticipant =
    meeting?.participants?.find(
      (participant) =>
        participant.user_id === currentUser?.id
    );

  // ==================================================
  // RSVP
  // ==================================================

  const handleRsvp = async (
    status: RSVPStatus
  ) => {
    if (!meeting) {
      return;
    }

    setRsvpSubmitting(true);

    try {
      await meetingApi.rsvp(
        meeting.id,
        status
      );

      await loadMeeting();
    } catch (error) {
      console.error(
        "RSVP failed:",
        error
      );
    } finally {
      setRsvpSubmitting(false);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={5}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ==================================================
  // NOT FOUND
  // ==================================================

  if (notFound || !meeting) {
    return (
      <Typography color="text.secondary">
        This meeting was not found. It may have
        been automatically removed after its
        scheduled date passed.
      </Typography>
    );
  }

  // ==================================================
  // MEETING STATUS
  // ==================================================

  const started = hasMeetingStarted(
    meeting.meeting_date || "",
    meeting.start_time
  );

  // ==================================================
  // TIMELINE
  // ==================================================

  const timelineEvents =
    buildMeetingTimeline(
      meeting.start_time,
      meeting.end_time
    ).map((event) => ({
      time: event.time,
      title: event.event,
    }));

  // ==================================================
  // UI
  // ==================================================

  return (
    <>
      {/* ============================================
          MEETING INFORMATION
      ============================================ */}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5">
          {meeting.title}
        </Typography>

        {meeting.description && (
          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            {meeting.description}
          </Typography>
        )}

        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          {meeting.meeting_date || "Date not available"}

          {(meeting.start_time ||
            meeting.end_time) &&
            ` • ${
              meeting.start_time || "?"
            } - ${
              meeting.end_time || "?"
            }`}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Organizer:{" "}
          {meeting.organizer || "Unknown"}
        </Typography>

        {/* ==========================================
            JOIN MEETING
        ========================================== */}

        {meeting.join_url && (
          <Box mt={2}>
            <Button
              variant="outlined"
              size="small"
              href={meeting.join_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Meeting
            </Button>
          </Box>
        )}

        {/* ==========================================
            RSVP
        ========================================== */}

        {myParticipant && (
          <Box mt={2}>
            <Typography variant="subtitle2">
              Your response:
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              mt={1}
            >
              {/* ACCEPT */}

              <Chip
                label="Accept"
                color={
                  myParticipant.status ===
                  "accepted"
                    ? "success"
                    : "default"
                }
                onClick={() =>
                  handleRsvp("accepted")
                }
                disabled={rsvpSubmitting}
                clickable
              />

              {/* TENTATIVE */}

              <Chip
                label="Tentative"
                color={
                  myParticipant.status ===
                  "tentative"
                    ? "warning"
                    : "default"
                }
                onClick={() =>
                  handleRsvp("tentative")
                }
                disabled={rsvpSubmitting}
                clickable
              />

              {/* DECLINE */}

              <Chip
                label="Decline"
                color={
                  myParticipant.status ===
                  "declined"
                    ? "error"
                    : "default"
                }
                onClick={() =>
                  handleRsvp("declined")
                }
                disabled={rsvpSubmitting}
                clickable
              />
            </Stack>
          </Box>
        )}

        {/* ==========================================
            PARTICIPANTS
        ========================================== */}

        {meeting.participants &&
          meeting.participants.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2">
                Participants
              </Typography>

              <List dense>
                {meeting.participants.map(
                  (participant) => (
                    <ListItem
                      key={participant.id}
                      disableGutters
                    >
                      <ListItemText
                        primary={`User #${participant.user_id}`}
                        secondary={
                          participant.status
                        }
                      />
                    </ListItem>
                  )
                )}
              </List>
            </Box>
          )}
      </Paper>

      {/* ============================================
          TRANSCRIPT / AUDIO
      ============================================ */}

      {started ? (
        <>
          <TranscriptUploader
            meetingId={meeting.id}
          />

          <br />

          <AudioUploader
            meetingId={meeting.id}
          />
        </>
      ) : (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography color="text.secondary">
            Transcript and audio uploads will
            open once the meeting starts
            {meeting.start_time
              ? ` at ${meeting.start_time}`
              : ""}{" "}
            on{" "}
            {meeting.meeting_date ||
              "the scheduled date"}
            .
          </Typography>
        </Paper>
      )}

      <br />

      {/* ============================================
          TIMELINE
      ============================================ */}

      <MeetingTimeline
        events={timelineEvents}
      />

      <br />

      {/* ============================================
          CHAT
      ============================================ */}

      <ChatWindow />
    </>
  );
};

export default MeetingDetails;
