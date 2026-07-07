import type { MealType, TripEvent, TripEventLocation } from "@/types";
import type { Place } from "@/types";
import { formatCoordinates } from "@/lib/moment-location/geocoding";

type LabelTranslator = (key: string) => string;

export interface EventDisplayContext {
 type: TripEvent["type"];
 mealType?: MealType | null;
 placeName?: string | null;
 location?: TripEventLocation | null;
}

/** Human-readable moment label — never raw enum keys. */
export function resolveEventDisplayLabel(
 event: EventDisplayContext,
 tTypes: LabelTranslator,
 tMeals?: LabelTranslator,
): string {
 if (event.type === "FOOD" && event.mealType && tMeals) {
 return tMeals(event.mealType);
 }

 if (event.type === "SLEEP") {
 const sleepLabel =
 event.location?.name?.trim() || event.placeName?.trim();
 if (sleepLabel) return sleepLabel;
 }

 return tTypes(event.type);
}

export function resolveMomentLocationLabel(
 event: Pick<TripEvent, "location" | "placeId">,
 place?: Place,
): string | undefined {
 if (event.location?.name?.trim()) {
 return event.location.name.trim();
 }
 if (event.location) {
 return formatCoordinates(event.location.latitude, event.location.longitude);
 }
 if (place?.name) {
 return place.name;
 }
 return undefined;
}
