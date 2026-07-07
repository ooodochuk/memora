import type { DayActivityType } from "@/types";
import {
 ArrowUpFromLine,
 Bike,
 Building2,
 Camera,
 Car,
 Footprints,
 Mountain,
 Sparkles,
 Tent,
 Trees,
 UtensilsCrossed,
 Waves,
 type LucideIcon,
} from "lucide-react";

export const MAX_DAY_ACTIVITIES = 3;

/** All supported day activity types — stable order for pickers and filters */
export const DAY_ACTIVITY_OPTIONS = [
 "WALKING",
 "HIKING",
 "CYCLING",
 "DRIVING",
 "CAMPING",
 "CITY",
 "NATURE",
 "WATER_ACTIVITIES",
 "PHOTOGRAPHY",
 "FOOD_EXPERIENCE",
 "CLIMBING",
 "OTHER",
] as const satisfies readonly DayActivityType[];

/** Maps legacy niche tags to the universal set (filters, imports, old data). */
const LEGACY_DAY_ACTIVITY_MAP: Record<string, DayActivityType> = {
 BIKEPACKING: "CYCLING",
 TRAIL_RUNNING: "HIKING",
 BACKPACKING: "HIKING",
 VIA_FERRATA: "CLIMBING",
 ROAD_TRIP: "DRIVING",
 BEACH: "WATER_ACTIVITIES",
 KAYAKING: "WATER_ACTIVITIES",
 SWIMMING: "WATER_ACTIVITIES",
 SKIING: "NATURE",
 EXPLORATION: "NATURE",
};

export function normalizeDayActivities(
 activities: readonly string[],
): DayActivityType[] {
 const seen = new Set<DayActivityType>();
 const normalized: DayActivityType[] = [];

 for (const raw of activities) {
 const mapped =
 (LEGACY_DAY_ACTIVITY_MAP[raw] as DayActivityType | undefined) ??
 (DAY_ACTIVITY_OPTIONS.includes(raw as DayActivityType)
 ? (raw as DayActivityType)
 : undefined);

 if (!mapped || seen.has(mapped)) continue;
 seen.add(mapped);
 normalized.push(mapped);
 if (normalized.length >= MAX_DAY_ACTIVITIES) break;
 }

 return normalized;
}

export const dayActivityIcons: Record<DayActivityType, LucideIcon> = {
 WALKING: Footprints,
 HIKING: Mountain,
 CYCLING: Bike,
 DRIVING: Car,
 CAMPING: Tent,
 CITY: Building2,
 NATURE: Trees,
 WATER_ACTIVITIES: Waves,
 PHOTOGRAPHY: Camera,
 FOOD_EXPERIENCE: UtensilsCrossed,
 CLIMBING: ArrowUpFromLine,
 OTHER: Sparkles,
};

export interface DayActivityStyle {
 bg: string;
 fg: string;
}

export const dayActivityStyles: Record<DayActivityType, DayActivityStyle> = {
 WALKING: {
 bg: "color-mix(in oklch, var(--event-hike) 16%, transparent)",
 fg: "var(--event-hike-fg)",
 },
 HIKING: {
 bg: "color-mix(in oklch, var(--event-hike) 22%, transparent)",
 fg: "var(--event-hike-fg)",
 },
 CYCLING: {
 bg: "color-mix(in oklch, var(--event-bike) 20%, transparent)",
 fg: "var(--event-bike-fg)",
 },
 DRIVING: {
 bg: "color-mix(in oklch, var(--event-transport) 18%, transparent)",
 fg: "var(--event-transport-fg)",
 },
 CAMPING: {
 bg: "color-mix(in oklch, var(--event-sleep) 20%, transparent)",
 fg: "var(--event-sleep-fg)",
 },
 CITY: {
 bg: "color-mix(in oklch, var(--event-place) 18%, transparent)",
 fg: "var(--event-place-fg)",
 },
 NATURE: {
 bg: "color-mix(in oklch, var(--event-place) 22%, transparent)",
 fg: "var(--event-place-fg)",
 },
 WATER_ACTIVITIES: {
 bg: "color-mix(in oklch, var(--event-photo) 18%, transparent)",
 fg: "var(--event-photo-fg)",
 },
 PHOTOGRAPHY: {
 bg: "color-mix(in oklch, var(--event-photo) 22%, transparent)",
 fg: "var(--event-photo-fg)",
 },
 FOOD_EXPERIENCE: {
 bg: "color-mix(in oklch, var(--event-food) 20%, transparent)",
 fg: "var(--event-food-fg)",
 },
 CLIMBING: {
 bg: "color-mix(in oklch, var(--event-hike) 20%, transparent)",
 fg: "var(--event-hike-fg)",
 },
 OTHER: {
 bg: "color-mix(in oklch, var(--muted) 80%, transparent)",
 fg: "var(--muted-foreground)",
 },
};

/** Activity types that imply hiking distance in statistics */
export const HIKING_DAY_ACTIVITIES: DayActivityType[] = [
 "WALKING",
 "HIKING",
 "CLIMBING",
];

/** Activity types that imply cycling distance in statistics */
export const CYCLING_DAY_ACTIVITIES: DayActivityType[] = ["CYCLING"];

/** Activity types that imply driving distance in statistics */
export const DRIVING_DAY_ACTIVITIES: DayActivityType[] = ["DRIVING"];

export function dayHasAnyActivity(
 day: { activities?: DayActivityType[] },
 types: DayActivityType[],
): boolean {
 const set = new Set(types);
 return (day.activities ?? []).some((activity) => set.has(activity));
}

export function countActivityDays(
 days: Array<{ activities?: DayActivityType[] }>,
 types: DayActivityType[],
): number {
 const set = new Set(types);
 return days.filter((day) =>
 (day.activities ?? []).some((activity) => set.has(activity)),
 ).length;
}

export function countActivityOccurrences(
 days: Array<{ activities?: DayActivityType[] }>,
): Map<DayActivityType, number> {
 const counts = new Map<DayActivityType, number>();
 for (const day of days) {
 for (const activity of day.activities ?? []) {
 counts.set(activity, (counts.get(activity) ?? 0) + 1);
 }
 }
 return counts;
}
