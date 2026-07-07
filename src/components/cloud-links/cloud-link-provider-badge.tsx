"use client";

import { useTranslations } from "next-intl";
import type { CloudLinkProvider } from "@/types";
import {
 cloudProviderIcons,
 cloudProviderStyles,
} from "@/lib/cloud-providers";
import { cn } from "@/lib/utils";

interface CloudLinkProviderBadgeProps {
 provider: CloudLinkProvider;
 className?: string;
 size?: "sm" | "md";
}

export function CloudLinkProviderBadge({
 provider,
 className,
 size = "sm",
}: CloudLinkProviderBadgeProps) {
 const t = useTranslations("cloudLink.providers");
 const Icon = cloudProviderIcons[provider];
 const colors = cloudProviderStyles[provider];

 return (
 <span
 className={cn(
 "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-medium tracking-wide",
 size === "md" && "px-3 py-1 text-sm",
 size === "sm" && "text-xs",
 className,
 )}
 style={{
 backgroundColor: colors.bg,
 color: colors.fg,
 borderColor: colors.border,
 }}
 >
 <Icon className="size-3 shrink-0" strokeWidth={1.75} aria-hidden />
 {t(provider)}
 </span>
 );
}
