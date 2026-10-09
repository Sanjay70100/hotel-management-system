import { useCallback, useEffect, useState } from "react";

import { getDashboardStats } from "../api/dashboard";
import type { DashboardStats } from "../types";

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard statistics
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch {
      setError("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch statistics when the hook initializes
  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
};