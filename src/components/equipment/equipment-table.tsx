"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Equipment, EquipmentCategory } from "@/types";
import { getEquipmentCategoryLabel } from "@/lib/equipment/categories";
import { formatInventoryWeight } from "@/lib/equipment/weight-display";
import { EquipmentIconGlyph } from "@/components/equipment/equipment-icon-glyph";
import { EquipmentItemActions } from "@/components/equipment/equipment-item-actions";
import { cn } from "@/lib/utils";

interface EquipmentTableProps {
  items: Equipment[];
  categoryMap: Map<string, EquipmentCategory>;
  onEdit: (item: Equipment) => void;
  onToggleActive: (item: Equipment) => void;
  onDelete: (item: Equipment) => void;
}

function EquipmentThumbnail({
  item,
  category,
  size = "md",
}: {
  item: Equipment;
  category?: EquipmentCategory;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "size-10" : "size-11";

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-md bg-muted/40",
        dim,
      )}
    >
      {item.photoUrl ? (
        <Image
          src={item.photoUrl}
          alt=""
          fill
          className="object-cover"
          sizes="44px"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <EquipmentIconGlyph
            icon={category?.icon ?? "Package"}
            className="size-4 text-muted-foreground/70"
          />
        </div>
      )}
    </div>
  );
}

function EquipmentStatusBadge({ isActive }: { isActive: boolean }) {
  const t = useTranslations("dashboard.equipment.status");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        isActive
          ? "bg-brand/15 text-brand"
          : "bg-muted text-muted-foreground",
      )}
    >
      {isActive ? t("active") : t("inactive")}
    </span>
  );
}

function WeightCell({ grams }: { grams: number | null | undefined }) {
  const safeGrams = typeof grams === "number" && Number.isFinite(grams) ? grams : 0;
  const weight = formatInventoryWeight(safeGrams);

  return (
    <div className="tabular-nums">
      <span className="text-sm text-foreground">{weight.grams}</span>
      {weight.kilograms ? (
        <span className="ml-1.5 text-xs text-muted-foreground">
          {weight.kilograms}
        </span>
      ) : null}
    </div>
  );
}

export function EquipmentTable({
  items,
  categoryMap,
  onEdit,
  onToggleActive,
  onDelete,
}: EquipmentTableProps) {
  const t = useTranslations("dashboard.pages.equipment.table");
  const tDefault = useTranslations("equipment.defaultCategories");

  return (
    <>
      {/* Desktop table (lg+ — matches dashboard sidebar breakpoint) */}
      <div className="max-lg:hidden overflow-hidden rounded-xl border border-border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                <th className="sticky top-0 z-10 bg-muted/95 px-4 py-3 backdrop-blur-sm">
                  {t("item")}
                </th>
                <th className="sticky top-0 z-10 bg-muted/95 px-4 py-3 backdrop-blur-sm">
                  {t("category")}
                </th>
                <th className="sticky top-0 z-10 bg-muted/95 px-4 py-3 backdrop-blur-sm">
                  {t("brandModel")}
                </th>
                <th className="sticky top-0 z-10 bg-muted/95 px-4 py-3 backdrop-blur-sm">
                  {t("weight")}
                </th>
                <th className="sticky top-0 z-10 bg-muted/95 px-4 py-3 backdrop-blur-sm">
                  {t("status")}
                </th>
                <th className="sticky top-0 z-10 bg-muted/95 px-4 py-3 text-right backdrop-blur-sm">
                  <span className="sr-only">{t("actions")}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const category = categoryMap.get(item.categoryId);
                const categoryLabel = category
                  ? getEquipmentCategoryLabel(category, tDefault)
                  : "—";
                const brandModel = [item.brand, item.model].filter(Boolean).join(" · ") || "—";

                return (
                  <tr
                    key={item.id}
                    className="border-b border-border/60 last:border-0 hover:bg-accent/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <EquipmentThumbnail item={item} category={category} />
                        <span className="truncate font-medium text-foreground">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="line-clamp-1">{categoryLabel}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="line-clamp-1">{brandModel}</span>
                    </td>
                    <td className="px-4 py-3">
                      <WeightCell grams={item.weightGrams} />
                    </td>
                    <td className="px-4 py-3">
                      <EquipmentStatusBadge isActive={item.isActive} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <EquipmentItemActions
                        item={item}
                        onEdit={onEdit}
                        onToggleActive={onToggleActive}
                        onDelete={onDelete}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile / tablet compact rows */}
      <ul className="space-y-2 lg:hidden" aria-label={t("mobileListLabel")}>
        {items.map((item) => {
          const category = categoryMap.get(item.categoryId);
          const categoryLabel = category
            ? getEquipmentCategoryLabel(category, tDefault)
            : null;
          const brandModel = [item.brand, item.model].filter(Boolean).join(" · ");
          const weight = formatInventoryWeight(
            typeof item.weightGrams === "number" && Number.isFinite(item.weightGrams)
              ? item.weightGrams
              : 0,
          );

          return (
            <li
              key={item.id}
              className="flex gap-3 rounded-xl border border-border bg-card p-3"
            >
              <EquipmentThumbnail item={item} category={category} size="sm" />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.name}
                  </p>
                  <EquipmentItemActions
                    item={item}
                    onEdit={onEdit}
                    onToggleActive={onToggleActive}
                    onDelete={onDelete}
                    align="end"
                  />
                </div>
                {categoryLabel ? (
                  <p className="truncate text-xs text-muted-foreground">
                    {categoryLabel}
                  </p>
                ) : null}
                {brandModel ? (
                  <p className="truncate text-xs text-muted-foreground">
                    {brandModel}
                  </p>
                ) : null}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="text-xs tabular-nums text-foreground">
                    {weight.grams}
                    {weight.kilograms ? (
                      <span className="ml-1 text-muted-foreground">
                        {weight.kilograms}
                      </span>
                    ) : null}
                  </span>
                  <EquipmentStatusBadge isActive={item.isActive} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
