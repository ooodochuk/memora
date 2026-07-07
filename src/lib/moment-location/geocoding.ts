export interface GeocodingResult {
 name: string;
 latitude: number;
 longitude: number;
}

export async function searchLocations(
 query: string,
): Promise<GeocodingResult[]> {
 const trimmed = query.trim();
 if (trimmed.length < 2) return [];

 const url = new URL("https://nominatim.openstreetmap.org/search");
 url.searchParams.set("q", trimmed);
 url.searchParams.set("format", "json");
 url.searchParams.set("limit", "5");

 const response = await fetch(url.toString(), {
 headers: { Accept: "application/json" },
 });

 if (!response.ok) return [];

 const data = (await response.json()) as Array<{
 display_name: string;
 lat: string;
 lon: string;
 }>;

 return data.map((item) => ({
 name: item.display_name.split(",").slice(0, 2).join(",").trim(),
 latitude: Number.parseFloat(item.lat),
 longitude: Number.parseFloat(item.lon),
 }));
}

export function tileCoords(
 latitude: number,
 longitude: number,
 zoom: number,
): { x: number; y: number } {
 const scale = 2 ** zoom;
 const x = Math.floor(((longitude + 180) / 360) * scale);
 const latRad = (latitude * Math.PI) / 180;
 const y = Math.floor(
 ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
 scale,
 );
 return { x, y };
}

export function tileUrl(zoom: number, x: number, y: number): string {
 return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
}

/** Approximate lat/lng from a click within a map viewport centered on a point. */
export function latLngFromMapClick(
 clickX: number,
 clickY: number,
 width: number,
 height: number,
 centerLat: number,
 centerLng: number,
 zoom: number,
): { latitude: number; longitude: number } {
 const degreesPerPixel = 360 / (256 * 2 ** zoom);
 const latScale = Math.cos((centerLat * Math.PI) / 180);
 const longitude =
 centerLng + (clickX - width / 2) * degreesPerPixel;
 const latitude =
 centerLat - (clickY - height / 2) * degreesPerPixel * latScale;
 return { latitude, longitude };
}

export function formatCoordinates(latitude: number, longitude: number): string {
 return `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
}
