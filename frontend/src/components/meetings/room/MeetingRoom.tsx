import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Drawer,
  Alert,
  CircularProgress,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import InfoIcon from "@mui/icons-material/Info";

import VideoGrid from "./VideoGrid";
import MeetingControls from "./MeetingControls";
import ParticipantList from "./ParticipantList";
import MeetingChat from "./MeetingChat";
import MeetingInfo from "./MeetingInfo";
import WaitingRoom from "./WaitingRoom";

import useMeetingRoom from "../../../hooks/useMeetingRoom";
import useWebRTC from "../../../hooks/useWebRtc";
import useMeetingChat from "../../../hooks/useMeetingChat";

import { useAuthStore } from "../../../store/authStore";
import { useMeetingRoomStore } from "../../../store/meetingRoomStore";

interface MeetingRoomProps {
  meetingId: string;
  onLeave?: () => void;
}

const MeetingRoom: React.FC<MeetingRoomProps> = ({
  meetingId,
  onLeave = () => {},
}) => {
  // ----- Authentication -----
  const user = useAuthStore((state: any) => state.user);
  const userId = user?.id || user?.user_id || "";
  const userName = user?.full_name || user?.fullName || user?.name || "Guest";

  // ----- UI state -----
  const [drawer, setDrawer] = useState<"participants" | "chat" | "info" | null>(null);
  const [showWaitingRoom, setShowWaitingRoom] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ----- Meeting room hook -----
  const meetingIdNum = Number(meetingId);

  const {
    room,
    loading,
    joined,
    isMuted,
    cameraEnabled,
    toggleMute,
    toggleCamera,
    leave,
  } = useMeetingRoom(meetingIdNum);

  const participants = useMeetingRoomStore((state: any) => state.participants);

  // ----- WebRTC -----
  const {
    localStream,
    remoteStreams,
    startCamera,
    stopCamera,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
  } = useWebRTC(meetingIdNum);

  // ----- Meeting chat -----
  const { messages, sendMessage } = useMeetingChat(meetingIdNum);

  // ----- Join meeting -----
  const handleJoinMeeting = async () => {
    try {
      setError(null);
      await startCamera();
      setShowWaitingRoom(false);
    } catch (err: any) {
      console.error("Failed to join meeting:", err);
      setError(err?.message || "Unable to join the meeting. Please try again.");
    }
  };

  // ----- Leave meeting -----
  const handleLeaveMeeting = async () => {
    try {
      stopCamera();
      await leave();
      if (onLeave) {
        onLeave();
      }
    } catch (err) {
      console.error("Error leaving meeting:", err);
      if (onLeave) {
        onLeave();
      }
    }
  };

  // ----- Audio toggle -----
  const handleToggleAudio = async () => {
    try {
      toggleAudio();
      await toggleMute();
    } catch (err) {
      console.error("Audio toggle failed:", err);
    }
  };

  // ----- Video toggle -----
  const handleToggleVideo = async () => {
    try {
      toggleVideo();
      await toggleCamera();
    } catch (err) {
      console.error("Video toggle failed:", err);
    }
  };

  // ----- Screen sharing -----
  const handleScreenShare = async () => {
    try {
      await startScreenShare();
    } catch (err) {
      console.error("Screen sharing failed:", err);
    }
  };

  // ----- Cleanup -----
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // ----- Loading state -----
  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#111827",
        }}
      >
        <Box sx={{ textAlign: "center", color: "white" }}>
          <CircularProgress />
          <Typography sx={{ mt: 2, color: "white" }}>Joining meeting...</Typography>
        </Box>
      </Box>
    );
  }

  // ----- Waiting room -----
  if (showWaitingRoom && !joined && room) {
    return (
      <WaitingRoom
        meeting={room}
        onJoin={handleJoinMeeting}
        onCancel={onLeave}
      />
    );
  }

  // ----- Error state -----
  if (error) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#111827",
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // ----- Main meeting room -----
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#111827",
      }}
    >
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          height: 64,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          backgroundColor: "#1f2937",
        }}
      >
        <Box>
          {room && (
            <Box>
              <Typography variant="h6" sx={{ color: "white" }}>
                {room.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "white" }}
              >
                {room.status.toUpperCase()}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => setDrawer("participants")}
            sx={{ color: "white" }}
          >
            <PeopleIcon />
          </IconButton>

          <IconButton
            onClick={() => setDrawer("chat")}
            sx={{ color: "white" }}
          >
            <ChatIcon />
          </IconButton>

          <IconButton
            onClick={() => setDrawer("info")}
            sx={{ color: "white" }}
          >
            <InfoIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Connection status */}
      {!joined && (
        <Alert severity="warning" sx={{ borderRadius: 0 }}>
          Connecting to meeting...
        </Alert>
      )}

      {/* Video area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          p: 2,
        }}
      >
        <VideoGrid
          localStream={localStream}
          remoteStreams={remoteStreams}
          isMuted={isMuted}
          cameraEnabled={cameraEnabled}
        />
      </Box>

      {/* Controls */}
      <Paper
        elevation={0}
        sx={{
          minHeight: 80,
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1f2937",
          borderRadius: 0,
          px: 2,
        }}
      >
        <MeetingControls
          isMuted={isMuted}
          cameraEnabled={cameraEnabled}
          onToggleMute={handleToggleAudio}
          onToggleCamera={handleToggleVideo}
          onScreenShare={handleScreenShare}
          onLeave={handleLeaveMeeting}
        />
      </Paper>

      {/* Side drawer */}
      <Drawer
        anchor="right"
        open={drawer !== null}
        onClose={() => setDrawer(null)}
      >
        <Box
          sx={{
            width: { xs: "100vw", sm: 380 },
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Drawer header */}
          <Box
            sx={{
              height: 64,
              px: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {drawer === "participants" && "Participants"}
              {drawer === "chat" && "Meeting Chat"}
              {drawer === "info" && "Meeting Information"}
            </Typography>

            <IconButton onClick={() => setDrawer(null)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Drawer content */}
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            {drawer === "participants" && <ParticipantList participants={participants} />}

            {drawer === "chat" && <MeetingChat messages={messages} onSend={sendMessage} />}

            {drawer === "info" && room && <MeetingInfo meeting={room} />}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default MeetingRoom;
