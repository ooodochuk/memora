export interface Photo {
 id: string;
 tripId: string;
 url: string;
 thumbUrl?: string;
 alt: string;
 caption?: string;
 width?: number;
 height?: number;
 takenAt?: string;
 placeId?: string;
 eventId?: string;
}
