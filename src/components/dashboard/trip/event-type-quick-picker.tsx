"use client";

import { useTranslations } from "next-intl";
import type { TripEventType } from "@/types";
import { eventTypeIcons } from "@/lib/event-types";
import { eventTypeStyles } from "@/lib/design-system/tokens";
import { TRIP_EVENT_MODAL_TYPE_OPTIONS } from "@/lib/validations/trip-event-modal-form";
import { cn } from "@/lib/utils";

interface EventTypeQuickPickerProps {
 value: TripEventType;
 onChange: (type: TripEventType) => void;
 error?: string;
}

export function EventTypeQuickPicker({
 value,
 onChange,
 error,
}: EventTypeQuickPickerProps) {
 const tTypes = useTranslations("event.types");

 return (
 <div className="space-y-2">
 <div
 className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-10"
 role="radiogroup"
 aria-label={tTypes("label")}
 aria-invalid={!!error}
 aria-describedby={error ? "event-type-error" : undefined}
 >
 {TRIP_EVENT_MODAL_TYPE_OPTIONS.map((type) => {
 const Icon = eventTypeIcons[type];
 const colors = eventTypeStyles(type);
 const selected = value === type;

 return (
 <button
 key={type}
 type="button"
 role="radio"
 aria-checked={selected}
 aria-label={tTypes(type)}
 onClick={() => onChange(type)}
 className={cn(
 "flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-all",
 "hover:border-border hover:bg-card",
 selected
 ? "border-primary/50 bg-primary/10 ring-2 ring-ring/25"
 : "border-border bg-card",
 )}
 >
 <span
 className="flex size-8 items-center justify-center rounded-full"
 style={{ backgroundColor: colors.bg, color: colors.fg }}
 >
 <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
 </span>
 <span className="line-clamp-2 text-center text-[9px] leading-tight font-medium text-muted-foreground sm:text-[10px]">
 {tTypes(type)}
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
