import { useState } from "react";
import {
  Paper,
  Button,
  Typography,
} from "@mui/material";

import { chatbotApi } from "../../api/chatbotApi";

interface Props {
  meetingId?: number;
}

const TranscriptUploader = ({ meetingId }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Select a transcript first.");
      return;
    }

    setUploading(true);

    try {
      const text = await file.text();
      const docId = meetingId ? `meeting-${meetingId}-${file.name}` : file.name;
      await chatbotApi.index(docId, text);
      alert("Transcript uploaded and indexed for AI search.");
    } catch (error) {
      console.error("Transcript indexing failed:", error);
      alert("Transcript uploaded, but indexing for AI search failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        Upload Transcript
      </Typography>

      <input
        type="file"
        accept=".txt,.doc,.docx,.pdf"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <Button
        sx={{ mt: 2 }}
        variant="contained"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </Paper>
  );
};

export default TranscriptUploader;