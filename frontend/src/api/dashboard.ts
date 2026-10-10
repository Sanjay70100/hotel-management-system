import api from "./axios";
import type { DashboardStats } from "../types";

// Fetch dashboard statistics from Spring Boot AdminService
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>("/api/admin/dashboard");
  return response.data;
};