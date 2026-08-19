import { useState } from "react";
import {
  Paper,
  Typography,
  Button,
} from "@mui/material";

interface Props {
  meetingId?: number;
}

const AudioUploader = ({ meetingId }: Props) => {
  const [audio, setAudio] = useState<File | null>(null);

  const handleUpload = () => {
    if (!audio) {
      alert("Select an audio file.");
      return;
    }

    console.log("Uploading audio for meeting", meetingId, audio);
    alert("Audio Uploaded");
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">
        Upload Meeting Audio
      </Typography>

      <input
        type="file"
        accept=".mp3,.wav,.m4a"
        onChange={(e) =>
          setAudio(e.target.files?.[0] || null)
        }
      />

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleUpload}
      >
        Upload Audio
      </Button>
    </Paper>
  );
};

export default AudioUploader;