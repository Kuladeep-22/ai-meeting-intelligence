export const hasMeetingStarted = (
  meetingDate: string,
  startTime?: string | null
): boolean => {
  if (!meetingDate) {
    return false;
  }

  const time = startTime || "00:00";

  const start = new Date(
    `${meetingDate}T${time}`
  );

  if (Number.isNaN(start.getTime())) {
    return false;
  }

  return start.getTime() <= Date.now();
};

// ==================================================
// TIMELINE
// ==================================================

export interface TimelineEvent {
  time: string;
  event: string;
}

const TIMELINE_STAGES: {
  label: string;
  ratio: number;
}[] = [
  {
    label: "Meeting Started",
    ratio: 0,
  },
  {
    label: "Meeting Ended",
    ratio: 1,
  },
];

// ==================================================
// PARSE TIME
// ==================================================

const parseMinutes = (
  time: string
): number | null => {
  const match =
    /^(\d{1,2}):(\d{2})$/.exec(time);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
};

// ==================================================
// FORMAT TIME
// ==================================================

const formatMinutes = (
  minutes: number
): string => {
  const date = new Date();

  date.setHours(
    Math.floor(minutes / 60),
    Math.round(minutes % 60),
    0,
    0
  );

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// ==================================================
// BUILD TIMELINE
// ==================================================

export const buildMeetingTimeline = (
  startTime?: string | null,
  endTime?: string | null
): TimelineEvent[] => {
  const startMinutes = startTime
    ? parseMinutes(startTime) ??
      10 * 60
    : 10 * 60;

  let endMinutes = endTime
    ? parseMinutes(endTime) ??
      startMinutes + 60
    : startMinutes + 60;

  if (endMinutes <= startMinutes) {
    endMinutes = startMinutes + 60;
  }

  const duration =
    endMinutes - startMinutes;

  return TIMELINE_STAGES.map(
    ({ label, ratio }) => ({
      event: label,
      time: formatMinutes(
        startMinutes +
          duration * ratio
      ),
    })
  );
};