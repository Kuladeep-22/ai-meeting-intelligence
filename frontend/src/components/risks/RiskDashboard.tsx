import {
  Grid,
  Paper,
  Typography,
} from "@mui/material";

interface RiskStats {
  totalRisks: number;
  highRisks: number;
  mitigatedRisks: number;
}

interface RiskDashboardProps {
  stats?: RiskStats;
}

const defaultStats: RiskStats = {
  totalRisks: 2,
  highRisks: 1,
  mitigatedRisks: 1,
};

const RiskDashboard = ({ stats = defaultStats }: RiskDashboardProps) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4">
            {stats.totalRisks}
          </Typography>

          <Typography>
            Total Risks
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" color="error">
            {stats.highRisks}
          </Typography>

          <Typography>
            High Risks
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" color="success.main">
            {stats.mitigatedRisks}
          </Typography>

          <Typography>
            Mitigated Risks
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RiskDashboard;