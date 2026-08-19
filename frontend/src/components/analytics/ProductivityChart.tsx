import {
  Paper,
  Typography,
} from "@mui/material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ProductivityData {
  day: string;
  productivity: number;
}

const defaultData: ProductivityData[] = [
  { day: "Mon", productivity: 60 },
  { day: "Tue", productivity: 72 },
  { day: "Wed", productivity: 65 },
  { day: "Thu", productivity: 90 },
  { day: "Fri", productivity: 85 },
];

interface ProductivityChartProps {
  data?: ProductivityData[];
}

const ProductivityChart = ({ data = defaultData }: ProductivityChartProps) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        Meeting Productivity
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="productivity"
            stroke="#1976d2"
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default ProductivityChart;