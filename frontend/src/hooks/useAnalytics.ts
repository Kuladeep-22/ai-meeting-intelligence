import { useEffect, useState } from "react";

import { analyticsApi } from "../api/analyticsApi";

export const useAnalytics = () => {
  const [analytics, setAnalytics] =
    useState(null);

  const loadAnalytics = async () => {
    try {
      const response =
        await analyticsApi.getDashboard();

      setAnalytics(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return {
    analytics,
    refresh: loadAnalytics,
  };
};