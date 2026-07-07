import type { DashboardHomeData } from "@/types/dashboard";
import {
  computeDashboardStats,
  emptyDashboardStats,
} from "@/lib/dashboard/journey-stats";

export function getDashboardHomeData(ownerId: string): DashboardHomeData {
  return {
    stats: computeDashboardStats(ownerId),
  };
}

export function getEmptyDashboardHomeData(): DashboardHomeData {
  return {
    stats: emptyDashboardStats(),
  };
}
