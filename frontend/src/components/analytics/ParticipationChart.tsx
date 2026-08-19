import {
  Paper,
  Typography,
} from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ParticipantData {
  name: string;
  value: number;
}

const defaultData: ParticipantData[] = [
  { name: "Rahul", value: 40 },
  { name: "Anjali", value: 30 },
  { name: "Kiran", value: 20 },
  { name: "Others", value: 10 },
];

const defaultColors = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#9c27b0",
];

interface ParticipationChartProps {
  data?: ParticipantData[];
  colors?: string[];
}

const ParticipationChart = ({ data = defaultData, colors = defaultColors }: ParticipationChartProps) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        Team Participation
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
            label
          >
            {data.map((item, index) => (
              <Cell
                key={item.name}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default ParticipationChart;