"use client";

import { getCloudLinksByTripId } from "@/lib/mock-data";
import { routes } from "@/constants/routes";
import type { Trip } from "@/types";
import { TripGalleryCard } from "@/components/trips/trip-gallery-card";
import { cn } from "@/lib/utils";

interface TripCardProps {
 trip: Trip;
 username: string;
 className?: string;
}

export function TripCard({ trip, username, className }: TripCardProps) {
 return (
 <TripGalleryCard
 trip={trip}
 href={routes.trip(username, trip.slug)}
 cloudLinkCount={getCloudLinksByTripId(trip.id).length}
 className={cn(className)}
 />
 );
}
