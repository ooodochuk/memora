import type { AdventureType } from "@/types";
import {
  Backpack,
  Bike,
  Car,
  Compass,
  Footprints,
  Mountain,
  Sailboat,
  Tent,
  type LucideIcon,
} from "lucide-react";

export const ADVENTURE_TYPE_OPTIONS = [
  "BIKEPACKING",
  "CYCLING",
  "HIKING",
  "TRAIL_RUNNING",
  "CAMPING",
  "ROAD_TRIP",
  "VIA_FERRATA",
  "WATER_ADVENTURE",
  "BACKPACKING",
  "MIXED",
] as const satisfies readonly AdventureType[];

export const adventureTypeIcons: Record<AdventureType, LucideIcon> = {
  BIKEPACKING: Bike,
  CYCLING: Bike,
  HIKING: Footprints,
  TRAIL_RUNNING: Footprints,
  CAMPING: Tent,
  ROAD_TRIP: Car,
  VIA_FERRATA: Mountain,
  WATER_ADVENTURE: Sailboat,
  BACKPACKING: Backpack,
  MIXED: Compass,
};

export interface AdventureTypeStyle {
  bg: string;
  fg: string;
}

export const adventureTypeStyles: Record<AdventureType, AdventureTypeStyle> = {
  BIKEPACKING: {
    bg: "color-mix(in oklch, var(--event-bike) 20%, transparent)",
    fg: "var(--event-bike-fg)",
  },
  CYCLING: {
    bg: "color-mix(in oklch, var(--event-bike) 16%, transparent)",
    fg: "var(--event-bike-fg)",
  },
  HIKING: {
    bg: "color-mix(in oklch, var(--event-hike) 20%, transparent)",
    fg: "var(--event-hike-fg)",
  },
  TRAIL_RUNNING: {
    bg: "color-mix(in oklch, var(--event-hike) 16%, transparent)",
    fg: "var(--event-hike-fg)",
  },
  CAMPING: {
    bg: "color-mix(in oklch, var(--event-sleep) 20%, transparent)",
    fg: "var(--event-sleep-fg)",
  },
  ROAD_TRIP: {
    bg: "color-mix(in oklch, var(--event-transport) 18%, transparent)",
    fg: "var(--event-transport-fg)",
  },
  VIA_FERRATA: {
    bg: "color-mix(in oklch, var(--event-hike) 22%, transparent)",
    fg: "var(--event-hike-fg)",
  },
  WATER_ADVENTURE: {
    bg: "color-mix(in oklch, var(--event-photo) 16%, transparent)",
    fg: "var(--event-photo-fg)",
  },
  BACKPACKING: {
    bg: "color-mix(in oklch, var(--event-hike) 18%, transparent)",
    fg: "var(--event-hike-fg)",
  },
  MIXED: {
    bg: "color-mix(in oklch, var(--event-place) 20%, transparent)",
    fg: "var(--event-place-fg)",
  },
};
