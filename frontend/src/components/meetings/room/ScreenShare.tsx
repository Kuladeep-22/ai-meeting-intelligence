import { useState } from "react";
import { Button, Box } from "@mui/material";

interface ScreenShareProps {
  onStart: () => Promise<void>;
  onStop: () => void;
}

const ScreenShare = ({
  onStart,
  onStop,
}: ScreenShareProps) => {
  const [sharing, setSharing] = useState(false);

  const handleClick = async () => {
    try {
      if (sharing) {
        onStop();
        setSharing(false);
      } else {
        await onStart();
        setSharing(true);
      }
    } catch (error) {
      console.error(
        "Screen sharing failed",
        error
      );
    }
  };

  return (
    <Box sx={{ display: "none" }}>
      <Button onClick={handleClick}>
        {sharing
          ? "Stop Sharing"
          : "Share Screen"}
      </Button>
    </Box>
  );
};

export default ScreenShare;