"use client";

import { useTranslations } from "next-intl";
import type { Trip } from "@/types";
import {
  CalendarDays,
  Camera,
  Cloud,
  List,
  MapPinned,
  Mountain,
  Route,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STAT_CARD_CLASS,
  STAT_ITEM_CLASS,
  STAT_ROW_CLASS,
} from "@/lib/stats-layout";

interface TripStatsProps {
  trip: Trip;
  cloudLinkCount: number;
  className?: string;
}

export function TripStats({ trip, cloudLinkCount, className }: TripStatsProps) {
  const t = useTranslations("dashboard.pages.tripDetail.stats");

  const stats = [
    {
      icon: CalendarDays,
      value: trip.stats.dayCount,
      label: t("days"),
    },
    {
      icon: List,
      value: trip.stats.eventCount,
      label: t("events"),
    },
    {
      icon: Camera,
      value: trip.stats.photoCount,
      label: t("photos"),
    },
    ...(cloudLinkCount > 0
      ? [
          {
            icon: Cloud,
            value: cloudLinkCount,
            label: t("cloudLinks"),
          },
        ]
      : []),
    ...(trip.stats.placeCount > 0
      ? [
          {
            icon: MapPinned,
            value: trip.stats.placeCount,
            label: t("places"),
          },
        ]
      : []),
    ...(trip.stats.distanceKm
      ? [
          {
            icon: Route,
            value: `${trip.stats.distanceKm}`,
            label: t("distance"),
            suffix: " km",
          },
        ]
      : []),
    ...(trip.stats.elevationGainM
      ? [
          {
            icon: Mountain,
            value: `${trip.stats.elevationGainM.toLocaleString()}`,
            label: t("elevation"),
            suffix: " m",
          },
        ]
      : []),
  ].filter((stat) => Number(stat.value) > 0);

  if (stats.length === 0) return null;

  return (
    <div className={cn(STAT_ROW_CLASS, className)}>
      {stats.map(({ icon: Icon, value, label, suffix }) => (
        <div key={label} className={STAT_ITEM_CLASS}>
          <div className={STAT_CARD_CLASS}>
            <Icon
              className="size-3.5 shrink-0 text-primary/80 sm:size-4"
              strokeWidth={1.75}
            />
            <span className="text-base font-medium tabular-nums leading-none text-foreground sm:text-lg">
              {value}
              {suffix ?? ""}
            </span>
            <span className="text-[9px] font-medium uppercase leading-tight tracking-wide text-muted-foreground sm:text-[10px] sm:tracking-wider">
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
