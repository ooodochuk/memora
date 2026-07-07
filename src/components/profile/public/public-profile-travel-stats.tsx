import { getTranslations } from "next-intl/server";
import type { PublicTravelStats } from "@/lib/public-profile";
import type { LucideIcon } from "lucide-react";
import {
  Bike,
  Camera,
  Car,
  Footprints,
  Globe2,
  Map,
  MapPinned,
  Mountain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STAT_CARD_CLASS,
  STAT_ITEM_CLASS,
  STAT_ROW_CLASS,
} from "@/lib/stats-layout";

interface PublicProfileTravelStatsProps {
  travelStats: PublicTravelStats;
  className?: string;
}

export async function PublicProfileTravelStats({
  travelStats,
  className,
}: PublicProfileTravelStatsProps) {
  const t = await getTranslations("publicProfile.stats");

  const items: Array<{
    key: string;
    icon: LucideIcon;
    value: number;
    label: string;
    suffix?: string;
  }> = [
    {
      key: "adventures",
      icon: Map,
      value: travelStats.adventureCount,
      label: t("adventures"),
    },
    {
      key: "countries",
      icon: Globe2,
      value: travelStats.countryCount,
      label: t("countries"),
    },
    {
      key: "days",
      icon: MapPinned,
      value: travelStats.totalDays,
      label: t("days"),
    },
  ];

  if (travelStats.hikingKm > 0) {
    items.push({
      key: "hiking",
      icon: Footprints,
      value: travelStats.hikingKm,
      label: t("hiking"),
      suffix: ` ${t("kmUnit")}`,
    });
  }

  if (travelStats.cyclingKm > 0) {
    items.push({
      key: "cycling",
      icon: Bike,
      value: travelStats.cyclingKm,
      label: t("cycling"),
      suffix: ` ${t("kmUnit")}`,
    });
  }

  if (travelStats.drivingKm > 0) {
    items.push({
      key: "driving",
      icon: Car,
      value: travelStats.drivingKm,
      label: t("driving"),
      suffix: ` ${t("kmUnit")}`,
    });
  }

  items.push(
    ...(travelStats.totalMoments > 0
      ? [
          {
            key: "moments",
            icon: Mountain,
            value: travelStats.totalMoments,
            label: t("moments"),
          },
        ]
      : []),
    ...(travelStats.totalPhotos > 0
      ? [
          {
            key: "photos",
            icon: Camera,
            value: travelStats.totalPhotos,
            label: t("photos"),
          },
        ]
      : []),
  );

  const visibleItems = items.filter((item) => item.value > 0);

  if (visibleItems.length === 0) return null;

  return (
    <div className={cn(STAT_ROW_CLASS, className)}>
      {visibleItems.map(({ key, icon: Icon, value, label, suffix }) => (
        <div key={key} className={STAT_ITEM_CLASS}>
          <div className={STAT_CARD_CLASS}>
            <Icon
              className="size-3.5 shrink-0 text-primary/80 sm:size-4"
              strokeWidth={1.75}
            />
            <span className="text-base font-medium tabular-nums leading-none text-foreground sm:text-lg">
              {value.toLocaleString()}
              {suffix ?? ""}
            </span>
            <span className="text-[9px] font-medium uppercase leading-tight tracking-wide text-muted-foreground sm:text-[10px] sm:tracking-wider">
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
