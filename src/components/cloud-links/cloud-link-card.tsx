"use client";

import { useTranslations } from "next-intl";
import type { CloudLink } from "@/types";
import {
 cloudProviderIcons,
 cloudProviderStyles,
 formatCloudLinkHost,
} from "@/lib/cloud-providers";
import { CloudLinkProviderBadge } from "@/components/cloud-links/cloud-link-provider-badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CloudLinkCardProps {
 link: CloudLink;
 showActions?: boolean;
 onEdit?: () => void;
 onDelete?: () => void;
 className?: string;
}

export function CloudLinkCard({
 link,
 showActions = false,
 onEdit,
 onDelete,
 className,
}: CloudLinkCardProps) {
 const t = useTranslations("cloudLink");
 const Icon = cloudProviderIcons[link.provider];
 const colors = cloudProviderStyles[link.provider];

 return (
 <article
 className={cn(
 "group/card flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between sm:p-5",
 "motion-safe:transition-[border-color,box-shadow] motion-safe:duration-200 hover:border-border hover:shadow-md",
 className,
 )}
 >
 <div className="flex min-w-0 flex-1 gap-3">
 <div
 className="flex size-10 shrink-0 items-center justify-center rounded-xl"
 style={{ backgroundColor: colors.bg, color: colors.fg }}
 >
 <Icon className="size-4" strokeWidth={1.75} aria-hidden />
 </div>

 <div className="min-w-0 space-y-2">
 <div className="flex flex-wrap items-center gap-2">
 <CloudLinkProviderBadge provider={link.provider} />
 <span className="truncate text-xs text-muted-foreground">
 {formatCloudLinkHost(link.url)}
 </span>
 </div>

 <h4 className="font-heading text-base font-medium tracking-tight">
 {link.title}
 </h4>

 {link.description && (
 <p className="text-sm leading-relaxed text-muted-foreground">
 {link.description}
 </p>
 )}
 </div>
 </div>

 <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-stretch lg:flex-row lg:items-center">
 <Button
 variant="outline"
 size="sm"
 className="gap-1.5"
 render={
 <a href={link.url} target="_blank" rel="noopener noreferrer" />
 }
 >
 {t("openLink")}
 <ExternalLink className="size-3.5" aria-hidden />
 </Button>

 {showActions && (
 <div className="flex gap-1">
 <Button
 type="button"
 variant="ghost"
 size="icon-sm"
 aria-label={t("editLink")}
 className="text-muted-foreground hover:text-foreground"
 onClick={onEdit}
 >
 <Pencil className="size-3.5" />
 </Button>
 <Button
 type="button"
 variant="ghost"
 size="icon-sm"
 aria-label={t("deleteLink")}
 className="text-muted-foreground hover:text-destructive"
 onClick={onDelete}
 >
 <Trash2 className="size-3.5" />
 </Button>
 </div>
 )}
 </div>
 </article>
 );
}
