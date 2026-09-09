import { Box } from "@mui/material";
import VideoTile from "./VideoTile";

interface VideoGridProps {
  localStream: MediaStream | null;

  remoteStreams: {
    userId: number;
    stream: MediaStream;
    userName: string;
  }[];

  isMuted: boolean;
  cameraEnabled: boolean;
}

const VideoGrid = ({
  localStream,
  remoteStreams,
  isMuted,
  cameraEnabled,
}: VideoGridProps) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 2,
        height: "100%",
      }}
    >
      {localStream && (
        <VideoTile
          stream={localStream}
          name="You"
          muted={isMuted}
          cameraEnabled={cameraEnabled}
          isLocal
        />
      )}

      {remoteStreams.map((participant) => (
        <VideoTile
          key={participant.userId}
          stream={participant.stream}
          name={participant.userName}
          muted={false}
          cameraEnabled
        />
      ))}
    </Box>
  );
};

export default VideoGrid;