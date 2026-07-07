"use client";

import { useTranslations } from "next-intl";
import type { TripStatus, TripVisibility } from "@/types";
import {
 tripStatusStyles,
 tripVisibilityStyles,
} from "@/lib/design-system/tokens";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
 status: TripStatus;
 className?: string;
 size?: "sm" | "md";
}

export function StatusBadge({
 status,
 className,
 size = "sm",
}: StatusBadgeProps) {
 const t = useTranslations("designSystem.status");
 const colors = tripStatusStyles(status);

 return (
 <span
 className={cn(
 "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
 size === "md" && "px-3 py-1 text-sm",
 className,
 )}
 style={{ backgroundColor: colors.bg, color: colors.fg }}
 >
 {t(status)}
 </span>
 );
}

interface VisibilityBadgeProps {
 visibility: TripVisibility;
 className?: string;
 size?: "sm" | "md";
}

export function VisibilityBadge({
 visibility,
 className,
 size = "sm",
}: VisibilityBadgeProps) {
 const t = useTranslations("designSystem.visibility");
 const colors = tripVisibilityStyles[visibility];

 return (
 <span
 className={cn(
 "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
 size === "md" && "px-3 py-1 text-sm",
 className,
 )}
 style={{ backgroundColor: colors.bg, color: colors.fg }}
 >
 {t(visibility)}
 </span>
 );
}
