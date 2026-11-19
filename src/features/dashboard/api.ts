import { apiRequest } from "../../shared/api/client";
import type { DashboardStats } from "../requests/types";

export function getDashboardStats(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>("/api/stats");
}
