export const hasMeetingStarted = (
  meetingDate: string,
  startTime?: string | null
): boolean => {
  const time = startTime || "00:00";
  const start = new Date(`${meetingDate}T${time}`);

  if (Number.isNaN(start.getTime())) return false;

  return start.getTime() <= Date.now();
};

export interface TimelineEvent {
  time: string;
  event: string;
}

const TIMELINE_STAGES: { label: string; ratio: number }[] = [
  { label: "Meeting Started", ratio: 0 },
  { label: "Requirements Discussion", ratio: 0.15 },
  { label: "Decision Taken", ratio: 0.5 },
  { label: "Action Items Assigned", ratio: 0.8 },
  { label: "Meeting Ended", ratio: 1 },
];

const parseMinutes = (time: string): number | null => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return null;

  return Number(match[1]) * 60 + Number(match[2]);
};

const formatMinutes = (minutes: number): string => {
  const date = new Date();
  date.setHours(0, Math.round(minutes), 0, 0);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Builds proportional timeline milestones between a meeting's start and end time.
export const buildMeetingTimeline = (
  startTime?: string | null,
  endTime?: string | null
): TimelineEvent[] => {
  const startMinutes = startTime ? (parseMinutes(startTime) ?? 10 * 60) : 10 * 60;
  let endMinutes = endTime ? (parseMinutes(endTime) ?? startMinutes + 60) : startMinutes + 60;

  if (endMinutes <= startMinutes) {
    endMinutes = startMinutes + 60;
  }

  const duration = endMinutes - startMinutes;

  return TIMELINE_STAGES.map(({ label, ratio }) => ({
    event: label,
    time: formatMinutes(startMinutes + duration * ratio),
  }));
};
