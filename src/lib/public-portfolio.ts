import type { Trip } from "@/types";
import { isArchivedTripStatus } from "@/lib/reference/adventure-status";

/** Adventures visible on a traveller's public portfolio page. */
export function isPublicPortfolioAdventure(trip: Trip): boolean {
  return trip.visibility === "public" && !isArchivedTripStatus(trip.status);
}
