import { useEffect, useState } from "react";

import { decisionApi } from "../api/decisionApi";

export const useDecisions = () => {
  const [decisions, setDecisions] =
    useState([]);

  const loadDecisions = async () => {
    try {
      const response =
        await decisionApi.getAllDecisions();

      setDecisions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDecisions();
  }, []);

  return {
    decisions,
    refresh: loadDecisions,
  };
};