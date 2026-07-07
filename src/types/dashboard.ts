export interface DashboardStats {
  totalTrips: number;
  totalDays: number;
  countries: number;
  places: number;
  hikingKm: number;
  cyclingKm: number;
  drivingKm: number;
}

export interface DashboardHomeData {
  stats: DashboardStats;
}
