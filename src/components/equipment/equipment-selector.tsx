"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { Equipment, EquipmentCategory } from "@/types";
import {
 formatWeightGrams,
 getEquipmentCategoryLabel,
 resolveEquipmentIcon,
} from "@/lib/equipment/categories";
import { buildEquipmentCategoryMap } from "@/lib/equipment/category-accessors";
import { JournalCard } from "@/components/design-system/journal-card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface EquipmentSelectorProps {
 inventory: Equipment[];
 categories: EquipmentCategory[];
 selectedIds: string[];
 onChange: (ids: string[]) => void;
 className?: string;
}

export function EquipmentSelector({
 inventory,
 categories,
 selectedIds,
 onChange,
 className,
}: EquipmentSelectorProps) {
 const t = useTranslations("dashboard.equipmentSelector");
 const tDefault = useTranslations("equipment.defaultCategories");

 const categoryMap = useMemo(
 () => buildEquipmentCategoryMap(categories),
 [categories],
 );

 const activeItems = inventory.filter((item) => item.isActive);

 function toggle(id: string) {
 if (selectedIds.includes(id)) {
 onChange(selectedIds.filter((value) => value !== id));
 } else {
 onChange([...selectedIds, id]);
 }
 }

 if (activeItems.length === 0) {
 return (
 <p className="text-sm text-muted-foreground">{t("emptyInventory")}</p>
 );
 }

 return (
 <div className={cn("grid gap-2 sm:grid-cols-2", className)}>
 {activeItems.map((item) => {
 const selected = selectedIds.includes(item.id);
 const category = categoryMap.get(item.categoryId);
 const Icon = resolveEquipmentIcon(category?.icon ?? "Package");
 const categoryLabel = category
 ? getEquipmentCategoryLabel(category, tDefault)
 : "";

 return (
 <button
 key={item.id}
 type="button"
 onClick={() => toggle(item.id)}
 aria-pressed={selected}
 className="text-left"
 >
 <JournalCard
 className={cn(
 "flex items-start gap-3 p-3 transition-colors sm:p-4",
 selected
 ? "border-primary/40 bg-muted/30 ring-1 ring-ring/20"
 : "hover:border-border",
 )}
 >
 <span
 className={cn(
 "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border",
 selected
 ? "border-primary bg-primary text-primary-foreground"
 : "border-border bg-card",
 )}
 >
 {selected ? <Check className="size-3" strokeWidth={2.5} /> : null}
 </span>

 <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-primary">
 <Icon className="size-4" strokeWidth={1.75} />
 </span>

 <span className="min-w-0 flex-1">
 <span className="block truncate font-medium text-foreground">
 {item.name}
 </span>
 <span className="block truncate text-xs text-muted-foreground">
 {item.brand} · {item.model}
 </span>
 <span className="mt-1 flex flex-wrap gap-x-2 text-[11px] text-muted-foreground">
 {categoryLabel && <span>{categoryLabel}</span>}
 {categoryLabel && <span>·</span>}
 <span>{formatWeightGrams(item.weightGrams)}</span>
 </span>
 </span>
 </JournalCard>
 </button>
 );
 })}
 </div>
 );
}
