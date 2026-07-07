"use client";

import { useTranslations } from "next-intl";
import type { TripEventType } from "@/types";
import { eventTypeIcons } from "@/lib/event-types";
import { eventTypeStyles } from "@/lib/design-system/tokens";
import { TRIP_EVENT_TYPE_OPTIONS } from "@/lib/validations/trip-event-form";
import { cn } from "@/lib/utils";

interface EventTypePickerProps {
 value: TripEventType;
 onChange: (type: TripEventType) => void;
 error?: string;
}

export function EventTypePicker({
 value,
 onChange,
 error,
}: EventTypePickerProps) {
 const tTypes = useTranslations("event.types");
 const t = useTranslations("dashboard.tripEventForm.eventTypes");

 return (
 <div className="space-y-2">
 <div
 className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
 role="radiogroup"
 aria-invalid={!!error}
 aria-describedby={error ? "event-type-error" : undefined}
 >
 {TRIP_EVENT_TYPE_OPTIONS.map((type) => {
 const Icon = eventTypeIcons[type];
 const colors = eventTypeStyles(type);
 const selected = value === type;

 return (
 <button
 key={type}
 type="button"
 role="radio"
 aria-checked={selected}
 onClick={() => onChange(type)}
 className={cn(
 "flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200",
 "hover:border-border hover:bg-muted/50",
 selected
 ? "border-primary bg-muted/30 ring-2 ring-ring/25"
 : "border-border bg-card",
 )}
 >
 <span
 className="flex size-9 shrink-0 items-center justify-center rounded-full"
 style={{ backgroundColor: colors.bg, color: colors.fg }}
 >
 <Icon className="size-4" strokeWidth={1.75} aria-hidden />
 </span>
 <span className="min-w-0 space-y-0.5">
 <span className="block text-sm font-medium text-foreground">
 {tTypes(type)}
 </span>
 <span className="block text-xs leading-relaxed text-muted-foreground">
 {t(`${type}.description`)}
 </span>
 </span>
 </button>
 );
 })}
 </div>
 {error && (
 <p id="event-type-error" className="text-xs text-destructive" role="alert">
 {error}
 </p>
 )}
 </div>
 );
}
