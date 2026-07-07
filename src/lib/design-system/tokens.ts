import type { TripEventType, TripStatus, TripVisibility } from "@/types";

/** Event type → CSS custom property prefix */
export const eventTypeTokenMap: Record<TripEventType, string> = {
 SLEEP: "sleep",
 FOOD: "food",
 HIKE: "hike",
 BIKE: "bike",
 TRANSPORT: "transport",
 PLACE_VISIT: "place",
 PHOTO_VIDEO: "photo",
 EXPENSE: "expense",
 NOTE: "note",
 TIP: "tip",
};

export function eventTypeStyles(type: TripEventType): {
 bg: string;
 fg: string;
} {
 const token = eventTypeTokenMap[type];
 return {
 bg: `var(--event-${token})`,
 fg: `var(--event-${token}-fg)`,
 };
}

export const tripStatusTokenMap: Record<TripStatus, string> = {
 planning: "planning",
 draft: "draft",
 published: "published",
 archived: "archived",
};

export function tripStatusStyles(status: TripStatus): {
 bg: string;
 fg: string;
} {
 const token = tripStatusTokenMap[status];
 return {
 bg: `var(--status-${token})`,
 fg: `var(--status-${token}-fg)`,
 };
}

export const tripVisibilityStyles: Record<
 TripVisibility,
 { bg: string; fg: string }
> = {
 public: {
 bg: "var(--status-published)",
 fg: "var(--status-published-fg)",
 },
 private: {
 bg: "var(--status-draft)",
 fg: "var(--status-draft-fg)",
 },
 unlisted: {
 bg: "var(--status-planning)",
 fg: "var(--status-planning-fg)",
 },
};

/** Page container max widths — see .cursor/rules/memora-ux-architecture.mdc */
export const containerSizes = {
  /** Auth screens */
  auth: "max-w-md",
  /** Create/edit forms */
  form: "max-w-3xl",
  /** Dashboard, adventure detail, lists */
  dashboard: "max-w-screen-2xl",
  /** Long-form marketing copy */
  prose: "max-w-2xl",
  /** @deprecated Use `form` */
  sm: "max-w-3xl",
  /** @deprecated Use `dashboard` */
  md: "max-w-screen-2xl",
  /** @deprecated Use `dashboard` */
  lg: "max-w-screen-2xl",
  /** @deprecated Use `dashboard` */
  xl: "max-w-screen-2xl",
} as const;

/** Vertical rhythm for sections */
export const sectionSpacing = {
 sm: "py-10 sm:py-14",
 md: "py-14 sm:py-20",
 lg: "py-16 sm:py-24",
} as const;

/** Horizontal page padding — keep headers and containers aligned */
export const pagePadding = "px-5 sm:px-6 lg:px-10" as const;
