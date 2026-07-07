/**
 * Central route builders — keeps URL structure stable as social features land.
 * Locale prefix is handled by next-intl; paths here are locale-relative.
 */

export const routes = {
  home: () => "/",
  profile: (username: string) => `/profile/${username}`,
  trip: (username: string, tripSlug: string) =>
    `/profile/${username}/trips/${tripSlug}`,
  tripDay: (username: string, tripSlug: string, dayId: string) =>
    `/profile/${username}/trips/${tripSlug}/day/${dayId}`,
  /** Future: standalone public trip page */
  publicTrip: (tripSlug: string) => `/trips/${tripSlug}`,
} as const;

export const dashboardRoutes = {
  home: () => "/dashboard",
  /** List hub — same as home (legacy /dashboard/trips redirects here). */
  trips: () => "/dashboard",
  newTrip: () => "/dashboard/trips/new",
  trip: (id: string) => `/dashboard/trips/${id}`,
  editTrip: (id: string) => `/dashboard/trips/${id}/edit`,
  newDay: (tripId: string) => `/dashboard/trips/${tripId}/days/new`,
  editDay: (tripId: string, dayId: string) =>
    `/dashboard/trips/${tripId}/days/${dayId}/edit`,
  newMoment: (tripId: string, dayId: string) =>
    `/dashboard/trips/${tripId}/events/new?dayId=${dayId}`,
  /** @deprecated Use newMoment */
  newEvent: (tripId: string, dayId?: string) =>
    dayId
      ? `/dashboard/trips/${tripId}/events/new?dayId=${dayId}`
      : `/dashboard/trips/${tripId}/events/new`,
  editMoment: (tripId: string, eventId: string) =>
    `/dashboard/trips/${tripId}/events/${eventId}/edit`,
  /** @deprecated Use editMoment */
  editEvent: (tripId: string, eventId: string) =>
    `/dashboard/trips/${tripId}/events/${eventId}/edit`,
  profile: () => "/dashboard/profile",
  settings: () => "/dashboard/settings",
  places: () => "/dashboard/places",
  wishlist: () => "/dashboard/wishlist",
  equipment: () => "/dashboard/equipment",
  newEquipment: () => "/dashboard/equipment/new",
  equipmentItem: (id: string) => `/dashboard/equipment/${id}`,
  editEquipment: (id: string) => `/dashboard/equipment/${id}/edit`,
} as const;
