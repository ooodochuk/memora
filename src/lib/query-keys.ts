/**
 * TanStack Query integration point.
 * Replace mock-data accessors with query hooks when the backend is ready.
 *
 * Example future shape:
 * useProfile(username) → GET /api/profiles/:username
 * useTrip(slug) → GET /api/trips/:slug
 * useTripDays(tripId) → GET /api/trips/:id/days
 * useTripEvents(dayId) → GET /api/days/:id/events
 */

export const QUERY_KEYS = {
 profile: (username: string) => ["profile", username] as const,
 trip: (slug: string) => ["trip", slug] as const,
 tripDays: (tripId: string) => ["tripDays", tripId] as const,
 tripEvents: (dayId: string) => ["tripEvents", dayId] as const,
} as const;
