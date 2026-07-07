"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Place } from "@/types";
import { PlaceCreateForm } from "@/components/places/place-create-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceSelectorProps {
 tripId: string;
 places: Place[];
 value?: string;
 onChange: (placeId: string | undefined) => void;
 onCreatePlace: (place: Place) => void;
 defaultCountry?: string;
 defaultRegion?: string;
 className?: string;
}

export function PlaceSelector({
 tripId,
 places,
 value,
 onChange,
 onCreatePlace,
 defaultCountry = "",
 defaultRegion = "",
 className,
}: PlaceSelectorProps) {
 const t = useTranslations("dashboard.placeSelector");
 const tCategories = useTranslations("place.categories");
 const [query, setQuery] = useState("");
 const [creating, setCreating] = useState(false);

 const selected = places.find((place) => place.id === value);

 const filtered = useMemo(() => {
 const normalized = query.trim().toLowerCase();
 if (!normalized) return places;
 return places.filter(
 (place) =>
 place.name.toLowerCase().includes(normalized) ||
 place.region?.toLowerCase().includes(normalized) ||
 place.country?.toLowerCase().includes(normalized),
 );
 }, [places, query]);

 function handleCreate(place: Place) {
 onCreatePlace(place);
 onChange(place.id);
 setCreating(false);
 setQuery("");
 }

 return (
 <div className={cn("space-y-3", className)}>
 {selected && !creating && (
 <div className="flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/5 px-3 py-2.5">
 <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
 <div className="min-w-0 flex-1">
 <p className="truncate text-sm font-medium">{selected.name}</p>
 {(selected.region || selected.country) && (
 <p className="truncate text-xs text-muted-foreground">
 {[selected.region, selected.country].filter(Boolean).join(", ")}
 {selected.category ? ` · ${tCategories(selected.category)}` : ""}
 </p>
 )}
 </div>
 <Button
 type="button"
 variant="ghost"
 size="icon-sm"
 aria-label={t("clearSelection")}
 onClick={() => onChange(undefined)}
 >
 <X className="size-3.5" />
 </Button>
 </div>
 )}

 {!selected && !creating && (
 <>
 <Input
 value={query}
 onChange={(event) => setQuery(event.target.value)}
 placeholder={t("searchPlaceholder")}
 aria-label={t("searchPlaceholder")}
 />

 {query.trim() && filtered.length > 0 && (
 <ul
 className="max-h-44 space-y-1 overflow-y-auto rounded-xl border border-border bg-card p-1"
 role="listbox"
 aria-label={t("resultsLabel")}
 >
 {filtered.map((place) => (
 <li key={place.id}>
 <button
 type="button"
 role="option"
 aria-selected={value === place.id}
 onClick={() => {
 onChange(place.id);
 setQuery("");
 }}
 className="flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-card"
 >
 <MapPin
 className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
 aria-hidden
 />
 <span className="min-w-0">
 <span className="block text-sm font-medium">
 {place.name}
 </span>
 <span className="block text-xs text-muted-foreground">
 {[place.region, place.country]
 .filter(Boolean)
 .join(", ")}
 </span>
 </span>
 </button>
 </li>
 ))}
 </ul>
 )}

 {query.trim() && filtered.length === 0 && (
 <p className="text-sm text-muted-foreground">{t("noResults")}</p>
 )}

 <Button
 type="button"
 variant="ghost"
 size="sm"
 className="h-auto gap-1.5 px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
 onClick={() => setCreating(true)}
 >
 <Plus className="size-3.5 text-primary" />
 {t("createNew")}
 </Button>
 </>
 )}

 {creating && (
 <PlaceCreateForm
 tripId={tripId}
 defaultName={query.trim()}
 defaultCountry={defaultCountry}
 defaultRegion={defaultRegion}
 onSave={handleCreate}
 onCancel={() => setCreating(false)}
 />
 )}
 </div>
 );
}
