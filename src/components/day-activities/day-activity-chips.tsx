"use client";

import { useTranslations } from "next-intl";
import type { DayActivityType } from "@/types";
import {
 DAY_ACTIVITY_OPTIONS,
 MAX_DAY_ACTIVITIES,
 dayActivityIcons,
 dayActivityStyles,
} from "@/lib/day-activities";
import { cn } from "@/lib/utils";

interface DayActivityPickerProps {
 value: DayActivityType[];
 onChange: (activities: DayActivityType[]) => void;
 className?: string;
}

export function DayActivityPicker({
 value,
 onChange,
 className,
}: DayActivityPickerProps) {
 const t = useTranslations("dayActivities");
 const tTypes = useTranslations("dayActivities.types");
 const atLimit = value.length >= MAX_DAY_ACTIVITIES;

 function toggle(activity: DayActivityType) {
 if (value.includes(activity)) {
 onChange(value.filter((item) => item !== activity));
 return;
 }

 if (atLimit) return;
 onChange([...value, activity]);
 }

 return (
 <div className={cn("space-y-3", className)} id="day-activities">
 <div className="flex items-baseline justify-between gap-3">
 <p className="text-xs leading-relaxed text-muted-foreground">
 {t("pickerHint")}
 </p>
 <p
 className="shrink-0 text-[11px] tabular-nums text-muted-foreground"
 aria-live="polite"
 >
 {t("pickerCount", { count: value.length, max: MAX_DAY_ACTIVITIES })}
 </p>
 </div>
 <div
 className="flex flex-wrap gap-2"
 role="group"
 aria-label={t("pickerLabel")}
 >
 {DAY_ACTIVITY_OPTIONS.map((activity) => {
 const Icon = dayActivityIcons[activity];
 const colors = dayActivityStyles[activity];
 const selected = value.includes(activity);
 const disabled = !selected && atLimit;

 return (
 <button
 key={activity}
 type="button"
 aria-pressed={selected}
 aria-disabled={disabled}
 disabled={disabled}
 onClick={() => toggle(activity)}
 className={cn(
 "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-all",
 "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
 selected
 ? "border-brand/35 text-foreground shadow-sm ring-1 ring-brand/15"
 : "border-border bg-card text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground",
 disabled && "cursor-not-allowed opacity-45 hover:bg-card hover:text-muted-foreground",
 )}
 style={
 selected
 ? {
 backgroundColor: colors.bg,
 color: colors.fg,
 borderColor:
 "color-mix(in oklch, var(--primary) 35%, var(--border))",
 }
 : undefined
 }
 >
 <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
 {tTypes(activity)}
 </button>
 );
 })}
 </div>
 {atLimit && (
 <p className="text-[11px] text-muted-foreground">{t("pickerLimit")}</p>
 )}
 </div>
 );
}

interface DayActivityListProps {
 activities: DayActivityType[];
 size?: "sm" | "md";
 className?: string;
}

export function DayActivityList({
 activities,
 size = "sm",
 className,
}: DayActivityListProps) {
 const tTypes = useTranslations("dayActivities.types");

 if (activities.length === 0) return null;

 return (
 <ul
 className={cn("flex flex-wrap gap-1.5", className)}
 aria-label="Day activities"
 >
 {activities.map((activity) => {
 const Icon = dayActivityIcons[activity];
 const colors = dayActivityStyles[activity];

 return (
 <li key={activity}>
 <span
 className={cn(
 "inline-flex items-center gap-1.5 rounded-full border border-transparent font-medium",
 size === "sm" && "px-2 py-0.5 text-[11px]",
 size === "md" && "px-2.5 py-1 text-xs",
 )}
 style={{
 backgroundColor: colors.bg,
 color: colors.fg,
 borderColor: "color-mix(in oklch, var(--foreground) 8%, transparent)",
 }}
 >
 <Icon
 className={cn("shrink-0", size === "sm" ? "size-3" : "size-3.5")}
 strokeWidth={1.75}
 aria-hidden
 />
 {tTypes(activity)}
 </span>
 </li>
 );
 })}
 </ul>
 );
}
