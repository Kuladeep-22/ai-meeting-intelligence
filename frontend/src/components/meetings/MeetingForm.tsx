import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Stack,
  Alert,
  Autocomplete,
} from "@mui/material";

import { meetingApi } from "../../api/meetingApi";
import { usersApi, UserOption } from "../../api/usersApi";
import { useMeetingStore } from "../../store/meetingStore";
import { useAuthStore } from "../../store/authStore";

interface Props {
  onCreated?: () => void;
}

const MeetingForm = ({ onCreated }: Props) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [users, setUsers] = useState<UserOption[]>([]);
  const [participants, setParticipants] = useState<UserOption[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const addMeeting = useMeetingStore((state) => state.addMeeting);
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    usersApi
      .getUsers()
      .then((res) =>
        setUsers(res.data.filter((u) => u.id !== currentUser?.id))
      )
      .catch(() => setUsers([]));
  }, [currentUser?.id]);

  const handleSubmit = async () => {
    setError("");

    if (!title.trim() || !date || !organizer.trim()) {
      setError("Title, date, and organizer are required.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await meetingApi.createMeeting({
        title: title.trim(),
        meeting_date: date,
        start_time: startTime || undefined,
        end_time: endTime || undefined,
        organizer: organizer.trim(),
        participant_ids: participants.map((p) => p.id),
      });

      addMeeting(response.data);

      setTitle("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setOrganizer("");
      setParticipants([]);

      onCreated?.();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Failed to create meeting. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Meeting Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
        />

        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={submitting}
          InputLabelProps={{ shrink: true }}
        />

        <Stack direction="row" spacing={2}>
          <TextField
            label="Start Time"
            type="time"
            fullWidth
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={submitting}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="End Time"
            type="time"
            fullWidth
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={submitting}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>

        <TextField
          label="Organizer"
          value={organizer}
          onChange={(e) => setOrganizer(e.target.value)}
          disabled={submitting}
        />

        <Autocomplete
          multiple
          options={users}
          value={participants}
          onChange={(_, value) => setParticipants(value)}
          getOptionLabel={(option) => `${option.full_name} (${option.email})`}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          disabled={submitting}
          renderInput={(params) => (
            <TextField {...params} label="Add Participants" placeholder="Select users" />
          )}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create Meeting"}
        </Button>
      </Stack>
    </Paper>
  );
};

export default MeetingForm;