export interface Meeting {
  id: number;

  title: string;

  description: string;

  organizer: string;

  meetingDate: string;

  startTime: string;

  endTime: string;

  location: string;

  transcript?: string;

  audioFile?: string;

  status: "Scheduled" | "Completed" | "Cancelled";

  createdAt: string;

  updatedAt: string;
}