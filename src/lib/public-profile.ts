import { isMockMode } from "@/api/config";
import { fetchPublicPortfolio } from "@/features/public/api";
import type { PublicTravelStatsDto } from "@/features/public/types";
import { getProfileByUsername, getTripsByOwnerId } from "@/lib/mock-data/accessors";
import { publicProfileDtoToProfile } from "@/lib/profile/public-mappers";
import { adventureDtoToTrip } from "@/lib/api-mappers";
import { computeTravelModeDistances } from "@/lib/travel-mode-stats";
import type { Profile, Trip } from "@/types";

export type PublicTravelStats = PublicTravelStatsDto;

export function getPublicTripsForProfile(profileId: string): Trip[] {
  return getTripsByOwnerId(profileId)
    .filter((trip) => trip.visibility === "public" && trip.status === "published")
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );
}

export function computePublicTravelStats(trips: Trip[]): PublicTravelStats {
  const countries = new Set(
    trips.flatMap((trip) =>
      trip.country.split("·").map((part) => part.trim()).filter(Boolean),
    ),
  );

  const modeDistances = computeTravelModeDistances(trips);

  return {
    adventureCount: trips.length,
    countryCount: countries.size,
    totalDays: trips.reduce((sum, trip) => sum + trip.stats.dayCount, 0),
    totalMoments: trips.reduce((sum, trip) => sum + trip.stats.eventCount, 0),
    totalPhotos: trips.reduce((sum, trip) => sum + trip.stats.photoCount, 0),
    ...modeDistances,
  };
}

function getPublicProfileByUsernameMock(username: string): {
  profile: Profile;
  publicTrips: Trip[];
  travelStats: PublicTravelStats;
} | null {
  const profile = getProfileByUsername(username);
  if (!profile) return null;

  const publicTrips = getPublicTripsForProfile(profile.id);
  const travelStats = computePublicTravelStats(publicTrips);

  return { profile, publicTrips, travelStats };
}

export async function getPublicProfileByUsername(username: string): Promise<{
  profile: Profile;
  publicTrips: Trip[];
  travelStats: PublicTravelStats;
} | null> {
  if (isMockMode()) {
    return getPublicProfileByUsernameMock(username);
  }

  const portfolio = await fetchPublicPortfolio(username);
  if (!portfolio) return null;

  const profile = publicProfileDtoToProfile(portfolio.profile);
  const publicTrips = portfolio.adventures.map(adventureDtoToTrip);

  return {
    profile,
    publicTrips,
    travelStats: portfolio.travelStats,
  };
}
