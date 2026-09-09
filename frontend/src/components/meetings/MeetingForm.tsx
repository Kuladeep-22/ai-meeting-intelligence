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
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

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
        start_time: startTime,
        end_time: endTime,
      };

      const meeting = await createMeeting(data);

      onCreated?.(meeting);

      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
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