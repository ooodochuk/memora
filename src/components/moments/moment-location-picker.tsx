"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { TripEventLocation } from "@/types";
import {
 formatCoordinates,
 latLngFromMapClick,
 searchLocations,
 tileCoords,
 tileUrl,
 type GeocodingResult,
} from "@/lib/moment-location/geocoding";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_CENTER = { latitude: 48.3794, longitude: 31.1656 };
const MAP_ZOOM = 13;
const TILE_GRID = 3;

interface MomentLocationPickerProps {
 value?: TripEventLocation | null;
 onChange: (location: TripEventLocation | null) => void;
 className?: string;
}

export function MomentLocationPicker({
 value,
 onChange,
 className,
}: MomentLocationPickerProps) {
 const t = useTranslations("momentLocation");
 const mapRef = useRef<HTMLDivElement>(null);
 const [open, setOpen] = useState(Boolean(value));
 const [query, setQuery] = useState("");
 const [results, setResults] = useState<GeocodingResult[]>([]);
 const [searching, setSearching] = useState(false);
 const [center, setCenter] = useState(() =>
 value
 ? { latitude: value.latitude, longitude: value.longitude }
 : DEFAULT_CENTER,
 );
 const [pin, setPin] = useState<TripEventLocation | null>(value ?? null);

 useEffect(() => {
 if (value) {
 // eslint-disable-next-line react-hooks/set-state-in-effect -- sync controlled value into map UI
 setPin(value);
 setCenter({ latitude: value.latitude, longitude: value.longitude });
 setOpen(true);
 }
 }, [value]);

 useEffect(() => {
 if (!query.trim()) {
 // eslint-disable-next-line react-hooks/set-state-in-effect -- clear stale search results
 setResults([]);
 return;
 }

 const timer = window.setTimeout(async () => {
 setSearching(true);
 try {
 setResults(await searchLocations(query));
 } catch {
 setResults([]);
 } finally {
 setSearching(false);
 }
 }, 400);

 return () => window.clearTimeout(timer);
 }, [query]);

 const applyPin = useCallback(
 (next: TripEventLocation | null) => {
 setPin(next);
 onChange(next);
 },
 [onChange],
 );

 function handleMapClick(event: React.MouseEvent<HTMLDivElement>) {
 const element = mapRef.current;
 if (!element) return;
 const rect = element.getBoundingClientRect();
 const coords = latLngFromMapClick(
 event.clientX - rect.left,
 event.clientY - rect.top,
 rect.width,
 rect.height,
 center.latitude,
 center.longitude,
 MAP_ZOOM,
 );
 applyPin({
 latitude: coords.latitude,
 longitude: coords.longitude,
 name: pin?.name,
 });
 }

 function handleSelectResult(result: GeocodingResult) {
 setCenter({ latitude: result.latitude, longitude: result.longitude });
 applyPin({
 name: result.name,
 latitude: result.latitude,
 longitude: result.longitude,
 });
 setQuery("");
 setResults([]);
 }

 function handleClear() {
 applyPin(null);
 setQuery("");
 setResults([]);
 setOpen(false);
 }

 const centerTile = tileCoords(center.latitude, center.longitude, MAP_ZOOM);
 const tiles: Array<{ x: number; y: number; key: string }> = [];
 const offset = Math.floor(TILE_GRID / 2);
 for (let dy = -offset; dy <= offset; dy += 1) {
 for (let dx = -offset; dx <= offset; dx += 1) {
 tiles.push({
 x: centerTile.x + dx,
 y: centerTile.y + dy,
 key: `${centerTile.x + dx}-${centerTile.y + dy}`,
 });
 }
 }

 if (!open) {
 return (
 <Button
 type="button"
 variant="ghost"
 size="sm"
 className={cn(
 "h-auto gap-1.5 px-0 text-muted-foreground hover:bg-transparent hover:text-foreground",
 className,
 )}
 onClick={() => setOpen(true)}
 >
 <MapPin className="size-3.5 text-primary" />
 {t("addLocation")}
 </Button>
 );
 }

 return (
 <div className={cn("space-y-3", className)}>
 <div className="flex items-center justify-between gap-2">
 <p className="text-sm font-medium">{t("label")}</p>
 <Button
 type="button"
 variant="ghost"
 size="icon-sm"
 aria-label={t("clear")}
 onClick={handleClear}
 >
 <X className="size-3.5" />
 </Button>
 </div>

 <div className="relative">
 <Search
 className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
 aria-hidden
 />
 <Input
 value={query}
 onChange={(event) => setQuery(event.target.value)}
 placeholder={t("searchPlaceholder")}
 className="pl-9"
 aria-busy={searching}
 />
 {results.length > 0 && (
 <ul
 className="absolute z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-xl border border-border bg-popover py-1 shadow-lg"
 role="listbox"
 >
 {results.map((result) => (
 <li key={`${result.latitude}-${result.longitude}`}>
 <button
 type="button"
 role="option"
 className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
 onClick={() => handleSelectResult(result)}
 >
 {result.name}
 </button>
 </li>
 ))}
 </ul>
 )}
 </div>

 <div
 ref={mapRef}
 role="button"
 tabIndex={0}
 aria-label={t("mapHint")}
 onClick={handleMapClick}
 onKeyDown={(event) => {
 if (event.key === "Enter" || event.key === " ") {
 event.preventDefault();
 }
 }}
 className="relative aspect-[16/10] cursor-crosshair overflow-hidden rounded-xl border border-border bg-muted"
 >
 <div
 className="absolute inset-0 grid"
 style={{
 gridTemplateColumns: `repeat(${TILE_GRID}, 1fr)`,
 gridTemplateRows: `repeat(${TILE_GRID}, 1fr)`,
 }}
 >
 {tiles.map((tile) => (
 <img
 key={tile.key}
 src={tileUrl(MAP_ZOOM, tile.x, tile.y)}
 alt=""
 className="size-full object-cover"
 draggable={false}
 />
 ))}
 </div>

 {pin && (
 <div
 className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full"
 aria-hidden
 >
 <MapPin className="size-8 fill-primary text-primary drop-shadow-md" />
 </div>
 )}
 </div>

 {pin && (
 <p className="text-xs text-muted-foreground">
 {pin.name ?? formatCoordinates(pin.latitude, pin.longitude)}
 </p>
 )}
 </div>
 );
}
