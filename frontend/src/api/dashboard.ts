import api from "./axios";
import type { DashboardStats } from "../types";

// Fetch dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>("/dashboard/stats");

  return response.data;
};