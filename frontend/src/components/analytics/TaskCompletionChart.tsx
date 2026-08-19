import {
  Paper,
  Typography,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TaskData {
  status: string;
  tasks: number;
}

const defaultData: TaskData[] = [
  {
    status: "Completed",
    tasks: 28,
  },
  {
    status: "Pending",
    tasks: 9,
  },
];

interface TaskCompletionChartProps {
  data?: TaskData[];
}

const TaskCompletionChart = ({ data = defaultData }: TaskCompletionChartProps) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        Task Completion
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="status" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="tasks"
            fill="#1976d2"
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default TaskCompletionChart;