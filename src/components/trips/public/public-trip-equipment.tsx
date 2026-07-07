import { getTranslations } from "next-intl/server";
import type { PublicTripEquipmentItem } from "@/lib/public-equipment";
import {
  formatWeightGrams,
  resolveEquipmentIcon,
} from "@/lib/equipment/categories";
import { JournalCard } from "@/components/design-system/journal-card";
import { SectionHeader } from "@/components/design-system/section-header";

interface PublicTripEquipmentProps {
  equipment: PublicTripEquipmentItem[];
}

export async function PublicTripEquipment({ equipment }: PublicTripEquipmentProps) {
  if (equipment.length === 0) {
    return null;
  }

  const t = await getTranslations("publicTrip.equipment");

  const totalWeight = equipment.reduce(
    (sum, item) => sum + (item.weightGrams ?? 0),
    0,
  );

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={
          totalWeight > 0
            ? t("subtitle", {
                count: equipment.length,
                weight: formatWeightGrams(totalWeight),
              })
            : t("subtitleCount", { count: equipment.length })
        }
      />

      <div className="grid gap-2 sm:grid-cols-2">
        {equipment.map((item) => {
          const Icon = resolveEquipmentIcon(item.categoryIcon);

          return (
            <JournalCard
              key={item.id}
              padding="sm"
              className="flex items-center gap-3"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
                <Icon className="size-4" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-foreground">
                  {item.name}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {[item.brand, item.model].filter(Boolean).join(" · ")}
                </span>
              </span>
              {item.weightGrams ? (
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {formatWeightGrams(item.weightGrams)}
                </span>
              ) : null}
            </JournalCard>
          );
        })}
      </div>
    </section>
  );
}
