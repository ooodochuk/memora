"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Equipment, EquipmentCategory } from "@/types";
import {
  formatPrice,
  getEquipmentCategoryLabel,
} from "@/lib/equipment/categories";
import { formatInventoryWeight } from "@/lib/equipment/weight-display";
import type { AppLocale } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { EquipmentIconGlyph } from "@/components/equipment/equipment-icon-glyph";
import { EquipmentItemActions } from "@/components/equipment/equipment-item-actions";
import { JournalCard } from "@/components/design-system/journal-card";
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
  const tDefault = useTranslations("equipment.defaultCategories");
  const locale = useLocale() as AppLocale;
  const categoryLabel = category
    ? getEquipmentCategoryLabel(category, tDefault)
    : null;
  const weight = formatInventoryWeight(item.weightGrams);
  const brandModel = [item.brand, item.model].filter(Boolean).join(" · ");

  return (
    <JournalCard
      className={cn(
        "flex h-full min-h-[7.5rem] flex-col p-2.5 sm:min-h-[8rem]",
        className,
      )}
    >
      <div className="flex min-h-0 flex-1 gap-2.5">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted/40 sm:size-16">
          {item.photoUrl ? (
            <Image
              src={item.photoUrl}
              alt=""
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <EquipmentIconGlyph
                icon={category?.icon ?? "Package"}
                className="size-5 text-muted-foreground/70 sm:size-6"
              />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {categoryLabel ? (
            <p className="truncate text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              {categoryLabel}
            </p>
          ) : null}
          <h3 className="line-clamp-2 text-sm leading-snug font-medium text-foreground">
            {item.name}
          </h3>
          {brandModel ? (
            <p className="truncate text-xs text-muted-foreground">{brandModel}</p>
          ) : null}
          <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
            <span className="text-xs tabular-nums text-foreground">
              {weight.grams}
              {weight.kilograms ? (
                <span className="ml-1 text-muted-foreground">{weight.kilograms}</span>
              ) : null}
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                item.isActive
                  ? "bg-brand/15 text-brand"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {item.isActive ? t("status.active") : t("status.inactive")}
            </span>
            {item.purchasePrice != null ? (
              <span className="truncate text-[10px] text-muted-foreground">
                {formatPrice(item.purchasePrice, locale)}
              </span>
            ) : null}
          </div>
        </div>

        <EquipmentItemActions
          item={item}
          onEdit={onEdit}
          onToggleActive={onToggleActive}
          onDelete={onDelete}
          align="end"
        />
      </div>
    </JournalCard>
  );
}
