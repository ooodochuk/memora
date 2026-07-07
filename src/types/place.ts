import type { PlaceCategory } from "./enums";

export interface Place {
 id: string;
 tripId: string;
 name: string;
 category: PlaceCategory;
 address?: string;
 lat?: number;
 lng?: number;
 country?: string;
 region?: string;
 description?: string;
 photoIds: string[];
}
