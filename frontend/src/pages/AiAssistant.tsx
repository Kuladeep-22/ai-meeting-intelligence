import { Grid } from "@mui/material";

import ChatWindow from "../components/chatbot/ChatWindow";

const AiAssistant = () => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 8 }}>
        <ChatWindow />
      </Grid>
    </Grid>
  );
};

export default AiAssistant;
