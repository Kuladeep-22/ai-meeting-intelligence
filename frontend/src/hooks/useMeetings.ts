import { useEffect } from "react";

import { meetingApi } from "../api/meetingApi";
import { useMeetingStore } from "../store/meetingStore";

export const useMeetings = () => {
  const {
    meetings,
    setMeetings,
  } = useMeetingStore();

  const loadMeetings = async () => {
    try {
      const response =
        await meetingApi.getMeetings();

      setMeetings(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  return {
    meetings,
    refresh: loadMeetings,
  };
};