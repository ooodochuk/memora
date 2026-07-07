import type { Trip, TripStatus } from "@/types";
import { trips } from "./trips";

export function removeTripById(id: string): void {
  const index = trips.findIndex((trip) => trip.id === id);
  if (index >= 0) {
    trips.splice(index, 1);
  }
}

export function setTripStatus(id: string, status: TripStatus): Trip | undefined {
  const trip = trips.find((entry) => entry.id === id);
  if (!trip) return undefined;
  trip.status = status;
  return trip;
}
