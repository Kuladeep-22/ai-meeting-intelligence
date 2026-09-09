import { useEffect, useRef } from "react";
import {
  Box,
  Typography,
} from "@mui/material";

interface VideoTileProps {
  stream: MediaStream;
  name: string;
  muted?: boolean;
  cameraEnabled?: boolean;
  isLocal?: boolean;
}

const VideoTile = ({
  stream,
  name,
  muted = false,
  cameraEnabled = true,
  isLocal = false,
}: VideoTileProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "#374151",
        borderRadius: 2,
        overflow: "hidden",
        minHeight: 200,
      }}
    >
      {cameraEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal || muted}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h3">
            {name.charAt(0).toUpperCase()}
          </Typography>
        </Box>
      )}

      <Typography
        sx={{
          position: "absolute",
          bottom: 10,
          left: 10,
          backgroundColor: "rgba(0,0,0,.6)",
          px: 1,
          py: 0.5,
          borderRadius: 1,
        }}
      >
        {name}
      </Typography>
    </Box>
  );
};

export default VideoTile;