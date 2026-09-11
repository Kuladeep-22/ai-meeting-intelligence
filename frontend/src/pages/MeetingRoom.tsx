import { useNavigate, useParams } from "react-router-dom";
import MeetingRoomComponent from "../components/meetings/room/MeetingRoom";

const MeetingRoomPage = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();

  if (!meetingId) {
    return null;
  }

  return (
    <MeetingRoomComponent
      meetingId={meetingId}
      onLeave={() => navigate("/meetings")}
    />
  );
};

export default MeetingRoomPage;