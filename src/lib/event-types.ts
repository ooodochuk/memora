import type { TripEventType } from "@/types";
import {
 Bed,
 Bike,
 Camera,
 Lightbulb,
 MapPin,
 Mountain,
 Notebook,
 Train,
 Utensils,
 Wallet,
 type LucideIcon,
} from "lucide-react";

export const eventTypeIcons: Record<TripEventType, LucideIcon> = {
 SLEEP: Bed,
 FOOD: Utensils,
 HIKE: Mountain,
 BIKE: Bike,
 TRANSPORT: Train,
 PLACE_VISIT: MapPin,
 PHOTO_VIDEO: Camera,
 EXPENSE: Wallet,
 NOTE: Notebook,
 TIP: Lightbulb,
};
