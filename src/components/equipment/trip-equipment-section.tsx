"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Equipment } from "@/types";
import { dashboardRoutes } from "@/constants/routes";
import {
  formatWeightGrams,
  getEquipmentCategoryLabel,
  resolveEquipmentIcon,
} from "@/lib/equipment/categories";
import { buildEquipmentCategoryMap } from "@/lib/equipment/category-accessors";
import { categoryDtoToCategory, equipmentDtoToEquipment } from "@/lib/api-mappers";
import {
  useEquipmentCategories,
  useEquipmentInventory,
  useSyncAdventureEquipment,
} from "@/features/equipment/hooks";
import { EquipmentSelector } from "@/components/equipment/equipment-selector";
import { JournalCard } from "@/components/design-system/journal-card";
import { SectionHeader } from "@/components/design-system/section-header";
import { Button } from "@/components/ui/button";
import { Check, Pencil, Plus } from "lucide-react";

interface TripEquipmentSectionProps {
  tripId: string;
  equipment: Equipment[];
  editable?: boolean;
}

export function TripEquipmentSection({
  tripId,
  equipment,
  editable = true,
}: TripEquipmentSectionProps) {
  const t = useTranslations("dashboard.tripEquipment");
  const tDefault = useTranslations("equipment.defaultCategories");
  const categoriesQuery = useEquipmentCategories();
  const inventoryQuery = useEquipmentInventory();
  const syncEquipment = useSyncAdventureEquipment(tripId);

  const [isManaging, setIsManaging] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const categoryMap = useMemo(() => {
    const categories = (categoriesQuery.data ?? []).map(categoryDtoToCategory);
    return buildEquipmentCategoryMap(categories);
  }, [categoriesQuery.data]);

  const inventory = useMemo(
    () =>
      (inventoryQuery.data?.items ?? [])
        .map(equipmentDtoToEquipment)
        .filter((item) => item.isActive),
    [inventoryQuery.data?.items],
  );

  const equipmentCategories = useMemo(
    () => (inventoryQuery.data?.categories ?? []).map(categoryDtoToCategory),
    [inventoryQuery.data?.categories],
  );

  const currentIds = useMemo(() => equipment.map((item) => item.id), [equipment]);

  const totalWeight = useMemo(
    () => equipment.reduce((sum, item) => sum + item.weightGrams, 0),
    [equipment],
  );

  const hasInventory = inventory.length > 0;
  const isSaving = syncEquipment.isPending;

  function startManaging() {
    setSelectedIds(currentIds);
    setIsManaging(true);
  }

  function cancelManaging() {
    setIsManaging(false);
    setSelectedIds([]);
  }

  async function handleSave() {
    try {
      await syncEquipment.mutateAsync({ selectedIds, currentIds });
      setIsManaging(false);
    } catch {
      // mutation error handled by react-query
    }
  }

  const headerAction = editable ? (
    isManaging ? (
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={cancelManaging}
          disabled={isSaving}
        >
          {t("cancel")}
        </Button>
        <Button
          type="button"
          variant="warm"
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? t("saving") : t("save")}
        </Button>
      </div>
    ) : hasInventory ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={startManaging}
      >
        <Pencil className="size-3.5" />
        {equipment.length === 0 ? t("add") : t("manage")}
      </Button>
    ) : (
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        render={<Link href={dashboardRoutes.newEquipment()} />}
      >
        <Plus className="size-3.5" />
        {t("createInventory")}
      </Button>
    )
  ) : undefined;

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={
          equipment.length > 0
            ? t("subtitle", {
                count: equipment.length,
                weight: formatWeightGrams(totalWeight),
              })
            : undefined
        }
        action={headerAction}
      />

      {isManaging ? (
        <JournalCard padding="md">
          <EquipmentSelector
            inventory={inventory}
            categories={equipmentCategories}
            selectedIds={selectedIds}
            onChange={setSelectedIds}
          />
        </JournalCard>
      ) : equipment.length === 0 ? (
        <JournalCard padding="md" className="space-y-3 text-center">
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
          {editable && hasInventory && (
            <Button
              type="button"
              variant="warm"
              size="sm"
              className="gap-1.5"
              onClick={startManaging}
            >
              <Plus className="size-3.5" />
              {t("add")}
            </Button>
          )}
          {editable && !hasInventory && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              render={<Link href={dashboardRoutes.newEquipment()} />}
            >
              <Plus className="size-3.5" />
              {t("createInventory")}
            </Button>
          )}
        </JournalCard>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {equipment.map((item) => {
            const category = categoryMap.get(item.categoryId);
            const Icon = resolveEquipmentIcon(category?.icon ?? "Package");
            const categoryLabel = category
              ? getEquipmentCategoryLabel(category, (id) => tDefault(id))
              : null;

            return (
              <JournalCard
                key={item.id}
                padding="sm"
                className="flex items-center gap-3"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/70 text-primary">
                  <Check className="size-3.5" strokeWidth={2.5} />
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                  <Icon className="size-4" strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1">
                  <Link
                    href={dashboardRoutes.equipmentItem(item.id)}
                    className="block truncate font-medium hover:text-primary"
                  >
                    {item.name}
                  </Link>
                  <span className="block truncate text-xs text-muted-foreground">
                    {[categoryLabel, item.brand, item.model]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {formatWeightGrams(item.weightGrams)}
                </span>
              </JournalCard>
            );
          })}
        </div>
      )}
    </section>
  );
}
