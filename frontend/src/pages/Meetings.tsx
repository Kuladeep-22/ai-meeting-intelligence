import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

import MeetingCard from "../components/meetings/MeetingCard";
import MeetingForm from "../components/meetings/MeetingForm";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useMeetings } from "../hooks/useMeetings";
import { meetingApi } from "../api/meetingApi";
import { useMeetingStore } from "../store/meetingStore";

const Meetings = () => {
  const navigate = useNavigate();
  const { meetings, refresh } = useMeetings();
  const removeMeeting = useMeetingStore((state) => state.removeMeeting);

  const [meetingToDelete, setMeetingToDelete] = useState<number | null>(null);

  const handleDelete = async () => {
    if (meetingToDelete == null) return;

    await meetingApi.deleteMeeting(meetingToDelete);
    removeMeeting(meetingToDelete);
    setMeetingToDelete(null);
  };

  return (
    <>
      <MeetingForm onCreated={refresh} />

      <br />

      {meetings.length === 0 ? (
        <Typography color="text.secondary">
          No meetings yet. Create one above to get started.
        </Typography>
      ) : (
        meetings.map((meeting) => (
          <MeetingCard
            key={meeting.id}
            title={meeting.title}
            date={meeting.meeting_date}
            startTime={meeting.start_time}
            endTime={meeting.end_time}
            organizer={meeting.organizer}
            onView={() => navigate(`/meetings/${meeting.id}`)}
            onDelete={() => setMeetingToDelete(meeting.id)}
          />
        ))
      )}

      <ConfirmDialog
        open={meetingToDelete !== null}
        title="Delete Meeting"
        message="Are you sure you want to delete this meeting? This cannot be undone."
        onClose={() => setMeetingToDelete(null)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default Meetings;