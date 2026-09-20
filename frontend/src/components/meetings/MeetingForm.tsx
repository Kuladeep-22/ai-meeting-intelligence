import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Autocomplete,
} from "@mui/material";
import {
  createMeeting,
  CreateMeetingData,
} from "../../api/meetingApi";
import { usersApi, UserOption } from "../../api/usersApi";
import { useAuthStore } from "../../store/authStore";

interface MeetingFormProps {
  onCreated?: (meeting: any) => void;
}

const MeetingForm = ({ onCreated }: MeetingFormProps) => {
  const currentUser = useAuthStore((state) => state.user);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [attendees, setAttendees] = useState<UserOption[]>([]);

  const [allUsers, setAllUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Default the organizer to the logged-in user, but leave it editable
  useEffect(() => {
    if (currentUser?.full_name) {
      setOrganizer(currentUser.full_name);
    }
  }, [currentUser?.full_name]);

  // Load the list of users once, to pick required attendees from
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await usersApi.getUsers();

        setAllUsers(response.data);
      } catch (error) {
        console.error("Failed to load users", error);
      }
    };

    loadUsers();
  }, []);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    try {
      setLoading(true);

      const data: CreateMeetingData = {
        title,
        description,
        meeting_date: meetingDate,
        start_time: startTime,
        end_time: endTime,
        organizer,
        location: location || undefined,
        participant_ids: attendees.map((user) => user.id),
      };

      const meeting = await createMeeting(data);

      onCreated?.(meeting);

      // Reset form
      setTitle("");
      setDescription("");
      setMeetingDate("");
      setStartTime("");
      setEndTime("");
      setLocation("");
      setAttendees([]);
      setOrganizer(currentUser?.full_name || "");
    } catch (error) {
      console.error("Failed to create meeting", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Meeting Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoComplete="off"
          required
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          autoComplete="off"
        />

        <Autocomplete
          multiple
          options={allUsers}
          value={attendees}
          onChange={(_event, value) => setAttendees(value)}
          getOptionLabel={(user) => user.full_name}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Invite Required Attendees"
              placeholder="Search people..."
            />
          )}
        />

        <TextField
          label="Meeting Date"
          type="date"
          value={meetingDate}
          onChange={(e) => setMeetingDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          autoComplete="off"
          required
        />

        <TextField
          label="Start Time"
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          autoComplete="off"
          required
        />

        <TextField
          label="End Time"
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          autoComplete="off"
          required
        />

        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Conference Room A"
          autoComplete="off"
        />

        <TextField
          label="Organizer"
          value={organizer}
          onChange={(e) => setOrganizer(e.target.value)}
          autoComplete="off"
          required
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Meeting"}
        </Button>
      </Stack>
    </Box>
  );
};

export default MeetingForm;
