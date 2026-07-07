"use client";

import { useTranslations } from "next-intl";
import type { TripEventType } from "@/types";
import {
 resolveEventDisplayLabel,
 type EventDisplayContext,
} from "@/lib/event-display";
import { eventTypeIcons } from "@/lib/event-types";
import { eventTypeStyles } from "@/lib/design-system/tokens";
import { IconBadge } from "@/components/design-system/icon-badge";
import { cn } from "@/lib/utils";

export function useEventDisplayLabel(context: EventDisplayContext): string {
 const tTypes = useTranslations("event.types");
 const tMeals = useTranslations("event.mealTypes");
 return resolveEventDisplayLabel(context, tTypes, tMeals);
}

interface EventTypeBadgeProps {
 type: TripEventType;
 label?: string;
 showLabel?: boolean;
 size?: "sm" | "md";
 className?: string;
}

export function EventTypeBadge({
 type,
 label,
 showLabel = true,
 size = "sm",
 className,
}: EventTypeBadgeProps) {
 const tTypes = useTranslations("event.types");
 const Icon = eventTypeIcons[type];
 const colors = eventTypeStyles(type);
 const displayLabel = label ?? tTypes(type);

 if (!showLabel) {
 return (
 <IconBadge
 icon={Icon}
 size={size === "sm" ? "md" : "lg"}
 label={displayLabel}
 className={className}
 style={{ backgroundColor: colors.bg, color: colors.fg }}
 />
 );
 }

 return (
 <span
 className={cn(
 "inline-flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1 text-xs font-medium tracking-wide",
 size === "md" && "px-3 py-1.5 text-sm",
 className,
 )}
 style={{ backgroundColor: colors.bg, color: colors.fg }}
 >
 <Icon className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
 {displayLabel}
 </span>
 );
}

interface EventTypeIconProps {
 type: TripEventType;
 label?: string;
 size?: "sm" | "md" | "lg";
 className?: string;
}

export function EventTypeIcon({
 type,
 label,
 size = "md",
 className,
}: EventTypeIconProps) {
 const tTypes = useTranslations("event.types");
 const Icon = eventTypeIcons[type];
 const colors = eventTypeStyles(type);

 return (
 <IconBadge
 icon={Icon}
 size={size}
 label={label ?? tTypes(type)}
 className={className}
 style={{ backgroundColor: colors.bg, color: colors.fg }}
 />
 );
}
