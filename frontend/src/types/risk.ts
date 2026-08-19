export interface Risk {
  id: number;

  meetingId: number;

  title: string;

  description: string;

  severity: "Low" | "Medium" | "High";

  owner: string;

  status: "Open" | "Mitigated" | "Closed";

  createdAt: string;
}