import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import {
  createMeeting,
  CreateMeetingData,
} from "../../api/meetingApi";

interface MeetingFormProps {
  onCreated?: (meeting: any) => void;
}

const MeetingForm = ({ onCreated }: MeetingFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [organizerId, setOrganizerId] = useState("");
  const [meetingCode, setMeetingCode] = useState("");
  const [joinUrl, setJoinUrl] = useState("");

  const [loading, setLoading] = useState(false);

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
        location,
        organizer_id: organizerId
          ? Number(organizerId)
          : undefined,
        meeting_code: meetingCode || undefined,
        join_url: joinUrl || undefined,
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
      setOrganizerId("");
      setMeetingCode("");
      setJoinUrl("");
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
          required
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
        />

        <TextField
          label="Meeting Date"
          type="date"
          value={meetingDate}
          onChange={(e) => setMeetingDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />

        <TextField
          label="Start Time"
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />

        <TextField
          label="End Time"
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />

        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Conference Room A"
        />

        <TextField
          label="Organizer ID"
          type="number"
          value={organizerId}
          onChange={(e) => setOrganizerId(e.target.value)}
          placeholder="Enter organizer ID"
        />

        <TextField
          label="Meeting Code"
          value={meetingCode}
          onChange={(e) => setMeetingCode(e.target.value)}
          placeholder="e.g. ABC-123"
        />

        <TextField
          label="Join URL"
          type="url"
          value={joinUrl}
          onChange={(e) => setJoinUrl(e.target.value)}
          placeholder="https://..."
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