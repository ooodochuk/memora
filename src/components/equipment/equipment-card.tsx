"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { MoreHorizontal, Pencil, Power, Trash2 } from "lucide-react";
import type { Equipment, EquipmentCategory } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import {
  formatPrice,
  formatWeightGrams,
  getEquipmentCategoryLabel,
} from "@/lib/equipment/categories";
import { EquipmentIconGlyph } from "@/components/equipment/equipment-icon-glyph";
import { JournalCard } from "@/components/design-system/journal-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface EquipmentCardProps {
  item: Equipment;
  category?: EquipmentCategory;
  className?: string;
  onEdit: (item: Equipment) => void;
  onToggleActive: (item: Equipment) => void;
  onDelete: (item: Equipment) => void;
}

export function EquipmentCard({
  item,
  category,
  className,
  onEdit,
  onToggleActive,
  onDelete,
}: EquipmentCardProps) {
  const t = useTranslations("dashboard.equipment");
  const tActions = useTranslations("dashboard.equipmentActions");
  const tDefault = useTranslations("equipment.defaultCategories");
  const locale = useLocale() as AppLocale;
  const categoryLabel = category
    ? getEquipmentCategoryLabel(category, tDefault)
    : null;

  return (
    <JournalCard
      hover
      className={cn("flex h-full flex-col overflow-hidden p-2 sm:p-2.5", className)}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted/30">
        {item.photoUrl ? (
          <Image
            src={item.photoUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 45vw, 180px"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <EquipmentIconGlyph
              icon={category?.icon ?? "Package"}
              className="size-7 text-muted-foreground/70"
            />
          </div>
        )}

        <span
          className={cn(
            "absolute top-1.5 right-1.5 size-2 rounded-full ring-2 ring-card",
            item.isActive ? "bg-brand" : "bg-muted-foreground/40",
          )}
          aria-hidden
        />
        <span className="sr-only">
          {item.isActive ? t("status.active") : t("status.inactive")}
        </span>

        <div className="absolute top-1.5 left-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  className="size-8 rounded-full bg-card/90 shadow-sm backdrop-blur-sm"
                  aria-label={tActions("menu")}
                />
              }
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Pencil className="size-4" />
                {tActions("edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleActive(item)}>
                <Power className="size-4" />
                {item.isActive ? tActions("deactivate") : tActions("activate")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => onDelete(item)}>
                <Trash2 className="size-4" />
                {tActions("deleteLabel")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-2">
        {categoryLabel && (
          <p className="truncate text-[10px] font-medium tracking-wide text-muted-foreground">
            {categoryLabel}
          </p>
        )}
        <h3 className="line-clamp-2 font-heading text-sm leading-snug font-medium tracking-tight text-foreground">
          {item.name}
        </h3>
        <p className="truncate text-[11px] text-muted-foreground">
          {item.brand}
          {item.model ? ` · ${item.model}` : ""}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1 text-[10px] tabular-nums text-muted-foreground">
          <span>{formatWeightGrams(item.weightGrams)}</span>
          {item.purchasePrice != null && (
            <span className="truncate">{formatPrice(item.purchasePrice, locale)}</span>
          )}
        </div>
      </div>
    </JournalCard>
  );
}
