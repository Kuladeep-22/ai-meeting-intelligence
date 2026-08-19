export interface Task {
  id: number;

  meetingId: number;

  title: string;

  description: string;

  assignedTo: string;

  deadline: string;

  priority: "Low" | "Medium" | "High";

  status:
    | "Pending"
    | "In Progress"
    | "Completed";

  createdAt: string;
}