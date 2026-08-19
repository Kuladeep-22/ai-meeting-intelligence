import { Grid } from "@mui/material";

import ProductivityChart from "../components/analytics/ProductivityChart";
import ParticipationChart from "../components/analytics/ParticipationChart";
import TaskCompletionChart from "../components/analytics/TaskCompletionChart";

const Analytics = () => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <ProductivityChart />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ParticipationChart />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TaskCompletionChart />
      </Grid>
    </Grid>
  );
};

export default Analytics;