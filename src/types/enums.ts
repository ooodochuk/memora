export type TripVisibility = "public" | "private" | "unlisted";

export type TripStatus =
  | "planning"
  | "draft"
  | "published"
  | "in_progress"
  | "completed"
  | "archived";

export type TripEventType =
 | "SLEEP"
 | "FOOD"
 | "HIKE"
 | "BIKE"
 | "TRANSPORT"
 | "PLACE_VISIT"
 | "PHOTO_VIDEO"
 | "EXPENSE"
 | "NOTE"
 | "TIP";

export type TripParticipantRole = "owner" | "editor" | "companion" | "viewer";

export type CloudLinkProvider =
 | "GOOGLE_DRIVE"
 | "ICLOUD"
 | "DROPBOX"
 | "ONEDRIVE"
 | "OTHER";

export type CloudLinkContentType =
 | "drone_footage"
 | "raw_photos"
 | "video"
 | "gpx"
 | "other";

export type PlaceCategory =
 | "HOSTEL"
 | "HOTEL"
 | "APARTMENT"
 | "CAMPSITE"
 | "RESTAURANT"
 | "CAFE"
 | "VIEWPOINT"
 | "TRAIL"
 | "BEACH"
 | "AIRPORT"
 | "TRAIN_STATION"
 | "PARKING"
 | "OTHER";

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "OTHER";

/** Universal day character tags — max 3 per day, used for filters and stats */
export type DayActivityType =
 | "WALKING"
 | "HIKING"
 | "CYCLING"
 | "DRIVING"
 | "CAMPING"
 | "CITY"
 | "NATURE"
 | "WATER_ACTIVITIES"
 | "PHOTOGRAPHY"
 | "FOOD_EXPERIENCE"
 | "CLIMBING"
 | "OTHER";

/** Primary type for an entire adventure — distinct from day activities and event types */
export type AdventureType =
 | "BIKEPACKING"
 | "CYCLING"
 | "HIKING"
 | "TRAIL_RUNNING"
 | "CAMPING"
 | "ROAD_TRIP"
 | "VIA_FERRATA"
 | "WATER_ADVENTURE"
 | "BACKPACKING"
 | "MIXED";
