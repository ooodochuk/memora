"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Plus } from "lucide-react";
import { dashboardRoutes } from "@/constants/routes";
import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content";
import { EquipmentList } from "@/components/equipment";
import { QueryState } from "@/components/data-state/query-state";
import { EquipmentGridSkeleton } from "@/components/data-state/equipment-grid-skeleton";
import { Button } from "@/components/ui/button";
import { useEquipmentInventory } from "@/features/equipment/hooks";

export function EquipmentPageClient() {
  const t = useTranslations("dashboard.pages.equipment");
  const inventoryQuery = useEquipmentInventory();

  return (
    <DashboardPageContent
      title={t("title")}
      subtitle={t("subtitle")}
      action={
        <Button
          variant="warm"
          render={<Link href={dashboardRoutes.newEquipment()} />}
        >
          <Plus className="size-4" />
          {t("addEquipment")}
        </Button>
      }
    >
      <QueryState
        query={inventoryQuery}
        loading={<EquipmentGridSkeleton />}
      >
        {(inventory) => (
          <EquipmentList
            items={inventory.items}
            categories={inventory.categories}
          />
        )}
      </QueryState>
    </DashboardPageContent>
  );
}
