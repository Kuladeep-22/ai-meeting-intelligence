import {
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import CallEndIcon from "@mui/icons-material/CallEnd";

interface MeetingControlsProps {
  isMuted: boolean;
  cameraEnabled: boolean;

  onToggleMute: () => void;
  onToggleCamera: () => void;

  onScreenShare: () => void;
  onLeave: () => void;
}

const MeetingControls = ({
  isMuted,
  cameraEnabled,
  onToggleMute,
  onToggleCamera,
  onScreenShare,
  onLeave,
}: MeetingControlsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        p: 2,
        backgroundColor: "#1f2937",
      }}
    >
      <Tooltip title={isMuted ? "Unmute" : "Mute"}>
        <IconButton
          onClick={onToggleMute}
          sx={{ color: "white" }}
        >
          {isMuted ? <MicOffIcon /> : <MicIcon />}
        </IconButton>
      </Tooltip>

      <Tooltip
        title={
          cameraEnabled
            ? "Turn camera off"
            : "Turn camera on"
        }
      >
        <IconButton
          onClick={onToggleCamera}
          sx={{ color: "white" }}
        >
          {cameraEnabled ? (
            <VideocamIcon />
          ) : (
            <VideocamOffIcon />
          )}
        </IconButton>
      </Tooltip>

      <Tooltip title="Share screen">
        <IconButton
          onClick={onScreenShare}
          sx={{ color: "white" }}
        >
          <ScreenShareIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Leave meeting">
        <IconButton
          onClick={onLeave}
          sx={{
            color: "white",
            backgroundColor: "red",
            "&:hover": {
              backgroundColor: "darkred",
            },
          }}
        >
          <CallEndIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default MeetingControls;