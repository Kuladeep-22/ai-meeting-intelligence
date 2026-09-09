import { useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import VideoGrid from "../components/meetings/room/VideoGrid";
import MeetingControls from "../components/meetings/room/MeetingControls";
import ParticipantList from "../components/meetings/room/ParticipantList";
import MeetingChat from "../components/meetings/room/MeetingChat";
import ScreenShare from "../components/meetings/room/ScreenShare";
import WaitingRoom from "../components/meetings/room/WaitingRoom";
import MeetingInfo from "../components/meetings/room/MeetingInfo";

import useMeetingRoom from "../hooks/useMeetingRoom";
import useWebRTC from "../hooks/useWebRtc";
import useMeetingChat from "../hooks/useMeetingChat";

const MeetingRoom = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();

  const id = Number(meetingId);

  const {
    room,
    loading,
    joined,
    isMuted,
    cameraEnabled,
    toggleMute,
    toggleCamera,
    leave,
  } = useMeetingRoom(id);

  const {
    localStream,
    remoteStreams,
    startCamera,
    stopCamera,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
  } = useWebRTC(id);

  const {
    messages,
    sendMessage,
  } = useMeetingChat(id);

  useEffect(() => {
    if (joined) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [joined]);

  const handleLeave = async () => {
    await leave();

    navigate("/meetings");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!room) {
    return (
      <Box p={4}>
        <Typography>
          Meeting not found.
        </Typography>
      </Box>
    );
  }

  if (!joined) {
    return (
      <WaitingRoom
        meeting={room}
        onJoin={() => window.location.reload()}
        onCancel={() => navigate("/meetings")}
      />
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#111827",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MeetingInfo meeting={room} />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        <Box sx={{ flex: 1, p: 2 }}>
          <VideoGrid
            localStream={localStream}
            remoteStreams={remoteStreams}
            isMuted={isMuted}
            cameraEnabled={cameraEnabled}
          />
        </Box>

        <Box
          sx={{
            width: 320,
            backgroundColor: "#1f2937",
          }}
        >
          <ParticipantList
            participants={room.participants}
          />

          <MeetingChat
            messages={messages}
            onSend={sendMessage}
          />
        </Box>
      </Box>

      <MeetingControls
        isMuted={isMuted}
        cameraEnabled={cameraEnabled}
        onToggleMute={() => {
          toggleMute();
          toggleAudio();
        }}
        onToggleCamera={() => {
          toggleCamera();
          toggleVideo();
        }}
        onScreenShare={startScreenShare}
        onLeave={handleLeave}
      />

      <ScreenShare
        onStart={startScreenShare}
        onStop={stopScreenShare}
      />
    </Box>
  );
};

export default MeetingRoom;