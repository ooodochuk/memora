"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search, Package } from "lucide-react";
import type { Equipment, EquipmentCategory } from "@/types";
import { getEquipmentCategoryLabel } from "@/lib/equipment/categories";
import { buildEquipmentCategoryMap } from "@/lib/equipment/category-accessors";
import { dashboardRoutes } from "@/constants/routes";
import { EquipmentCard } from "@/components/equipment/equipment-card";
import { EquipmentEditSheet } from "@/components/equipment/equipment-edit-sheet";
import { EquipmentDeleteDialog } from "@/components/equipment/equipment-delete-dialog";
import { EmptyState } from "@/components/design-system/empty-state";
import { useAppToast } from "@/components/design-system/app-toast";
import {
  useDeleteEquipment,
  useSetEquipmentActive,
} from "@/features/equipment/hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EquipmentFilter = "all" | "active" | "inactive";

interface EquipmentListProps {
  items: Equipment[];
  categories: EquipmentCategory[];
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

export function EquipmentList({ items, categories }: EquipmentListProps) {
  const t = useTranslations("dashboard.pages.equipment");
  const tDefault = useTranslations("equipment.defaultCategories");
  const tActions = useTranslations("dashboard.equipmentActions");
  const router = useRouter();
  const { showToast } = useAppToast();
  const isDesktop = useIsDesktop();
  const deleteMutation = useDeleteEquipment();
  const activeMutation = useSetEquipmentActive();
  const [activeFilter, setActiveFilter] = useState<EquipmentFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  const [deletingItem, setDeletingItem] = useState<Equipment | null>(null);

  const categoryMap = useMemo(
    () => buildEquipmentCategoryMap(categories),
    [categories],
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return items
      .filter((item) => {
        if (activeFilter === "active") return item.isActive;
        if (activeFilter === "inactive") return !item.isActive;
        return true;
      })
      .filter((item) =>
        categoryFilter === "all" ? true : item.categoryId === categoryFilter,
      )
      .filter((item) => {
        if (!query) return true;
        const category = categoryMap.get(item.categoryId);
        const categoryLabel = category
          ? getEquipmentCategoryLabel(category, tDefault)
          : "";
        return [item.name, item.brand, item.model, item.notes ?? "", categoryLabel]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, activeFilter, categoryFilter, searchQuery, categoryMap, tDefault]);

  const statusFilters: EquipmentFilter[] = ["all", "active", "inactive"];
  const statusLabels: Record<EquipmentFilter, string> = {
    all: t("filters.all"),
    active: t("filters.active"),
    inactive: t("filters.inactive"),
  };

  const usedCategoryIds = useMemo(() => {
    const ids = new Set(items.map((item) => item.categoryId));
    return categories.filter((category) => ids.has(category.id));
  }, [items, categories]);

  function handleEdit(item: Equipment) {
    if (isDesktop) {
      setEditingItem(item);
      return;
    }
    router.push(dashboardRoutes.editEquipment(item.id));
  }

  async function handleToggleActive(item: Equipment) {
    try {
      await activeMutation.mutateAsync({ id: item.id, active: !item.isActive });
      showToast(
        item.isActive ? tActions("deactivatedSuccess") : tActions("activatedSuccess"),
      );
    } catch {
      showToast(tActions("toggleError"), "error");
    }
  }

  async function handleDelete() {
    if (!deletingItem) return;
    try {
      await deleteMutation.mutateAsync(deletingItem.id);
      showToast(tActions("deleteSuccess"));
      setDeletingItem(null);
    } catch {
      showToast(tActions("deleteError"), "error");
    }
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
        size="md"
      />
    );
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {statusFilters.map((filter) => (
              <Button
                key={filter}
                type="button"
                variant={activeFilter === filter ? "warm" : "outline"}
                size="sm"
                className={cn(
                  "shrink-0 rounded-full px-4",
                  activeFilter !== filter && "bg-card",
                )}
                onClick={() => setActiveFilter(filter)}
              >
                {statusLabels[filter]}
              </Button>
            ))}
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Button
                type="button"
                variant={categoryFilter === "all" ? "secondary" : "outline"}
                size="sm"
                className="shrink-0 rounded-full px-3"
                onClick={() => setCategoryFilter("all")}
              >
                {t("filters.allCategories")}
              </Button>
              {usedCategoryIds.map((category) => (
                <Button
                  key={category.id}
                  type="button"
                  variant={
                    categoryFilter === category.id ? "secondary" : "outline"
                  }
                  size="sm"
                  className="shrink-0 rounded-full px-3"
                  onClick={() => setCategoryFilter(category.id)}
                >
                  {getEquipmentCategoryLabel(category, tDefault)}
                </Button>
              ))}
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t("searchPlaceholder")}
                className="rounded-full bg-card pl-9"
                aria-label={t("searchPlaceholder")}
              />
            </div>
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <EquipmentCard
                key={item.id}
                item={item}
                category={categoryMap.get(item.categoryId)}
                onEdit={handleEdit}
                onToggleActive={handleToggleActive}
                onDelete={setDeletingItem}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title={t("noResults")}
            description={t("noResultsDescription")}
            size="md"
          />
        )}
      </div>

      <EquipmentEditSheet
        equipmentId={editingItem?.id ?? null}
        open={editingItem !== null}
        onOpenChange={(open) => !open && setEditingItem(null)}
        onSaved={() => {
          setEditingItem(null);
          showToast(tActions("savedSuccess"));
        }}
      />

      <EquipmentDeleteDialog
        item={deletingItem}
        open={deletingItem !== null}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}
