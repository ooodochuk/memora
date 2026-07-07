"use client";

import { dashboardRoutes } from "@/constants/routes";
import { getCloudLinksByTripId } from "@/lib/mock-data";
import type { Trip } from "@/types";
import { TripGalleryCard } from "@/components/trips/trip-gallery-card";
import { cn } from "@/lib/utils";

export interface TripCardProps {
 trip: Trip;
 cloudLinkCount?: number;
 className?: string;
}

export function TripCard({ trip, cloudLinkCount, className }: TripCardProps) {
 const links =
 cloudLinkCount ?? getCloudLinksByTripId(trip.id).length;

 return (
 <TripGalleryCard
 trip={trip}
 href={dashboardRoutes.trip(trip.id)}
 cloudLinkCount={links}
 showManagementBadges
 className={cn(className)}
 />
 );
}
