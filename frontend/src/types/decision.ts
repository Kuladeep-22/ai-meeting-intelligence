export interface Decision {
  id: number;

  meetingId: number;

  title: string;

  description: string;

  owner: string;

  status: "Pending" | "Approved" | "Rejected";

  dueDate: string;

  version: number;

  createdAt: string;
}