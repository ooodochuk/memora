"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Map as MapIcon, Plus } from "lucide-react";
import type { Trip } from "@/types";
import {
  groupTripsByLifecycle,
  LIFECYCLE_ORDER,
  type TripLifecycle,
} from "@/lib/trip-lifecycle";
import { isArchivedTripStatus } from "@/lib/reference/adventure-status";
import { dashboardRoutes } from "@/constants/routes";
import { TripGalleryCard } from "@/components/trips/trip-gallery-card";
import { EmptyState } from "@/components/design-system/empty-state";
import { SectionHeader } from "@/components/design-system/section-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DashboardTripItem {
  trip: Trip;
  cloudLinkCount: number;
}

type AdventureListTab = "active" | "archived";

interface DashboardTripsByStatusProps {
  items: DashboardTripItem[];
}

const SECTION_TITLE_KEYS: Record<TripLifecycle, string> = {
  in_progress: "inProgress",
  planning: "planning",
  completed: "completed",
};

export function DashboardTripsByStatus({ items }: DashboardTripsByStatusProps) {
  const t = useTranslations("dashboard.pages.home.tripSections");
  const tHome = useTranslations("dashboard.pages.home");
  const [tab, setTab] = useState<AdventureListTab>("active");

  const activeItems = useMemo(
    () => items.filter((item) => !isArchivedTripStatus(item.trip.status)),
    [items],
  );
  const archivedItems = useMemo(
    () => items.filter((item) => isArchivedTripStatus(item.trip.status)),
    [items],
  );

  const grouped = useMemo(() => {
    const trips = activeItems.map((item) => item.trip);
    const byLifecycle = groupTripsByLifecycle(trips);
    const cloudLinkByTripId = new Map(
      activeItems.map((item) => [item.trip.id, item.cloudLinkCount]),
    );

    return LIFECYCLE_ORDER.map((lifecycle) => ({
      lifecycle,
      items: byLifecycle[lifecycle].map((trip) => ({
        trip,
        cloudLinkCount: cloudLinkByTripId.get(trip.id) ?? 0,
      })),
    })).filter((section) => section.items.length > 0);
  }, [activeItems]);

  if (items.length === 0) {
    return (
      <section className="space-y-6">
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} titleAs="h2" />
        <EmptyState
          icon={MapIcon}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={
            <Button variant="warm" render={<Link href={dashboardRoutes.newTrip()} />}>
              <Plus className="size-4" />
              {tHome("startTrip")}
            </Button>
          }
        />
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} titleAs="h2" />
        <div className="flex gap-2">
          {(["active", "archived"] as const).map((value) => (
            <Button
              key={value}
              type="button"
              variant={tab === value ? "warm" : "outline"}
              size="sm"
              className={cn("rounded-full px-4", tab !== value && "bg-card")}
              onClick={() => setTab(value)}
            >
              {t(`tabs.${value}`)}
            </Button>
          ))}
        </div>
      </div>

      {tab === "active" ? (
        grouped.length > 0 ? (
          <div className="space-y-12 sm:space-y-14">
            {grouped.map(({ lifecycle, items: sectionItems }) => (
              <section key={lifecycle} className="space-y-6">
                <SectionHeader
                  title={t(`${SECTION_TITLE_KEYS[lifecycle]}.title`)}
                  titleAs="h3"
                />
                <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {sectionItems.map(({ trip, cloudLinkCount }) => (
                    <TripGalleryCard
                      key={trip.id}
                      trip={trip}
                      href={dashboardRoutes.trip(trip.id)}
                      cloudLinkCount={cloudLinkCount}
                      showManagementBadges
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MapIcon}
            title={t("activeEmptyTitle")}
            description={t("activeEmptyDescription")}
            size="md"
          />
        )
      ) : archivedItems.length > 0 ? (
        <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {archivedItems.map(({ trip, cloudLinkCount }) => (
            <TripGalleryCard
              key={trip.id}
              trip={trip}
              href={dashboardRoutes.trip(trip.id)}
              cloudLinkCount={cloudLinkCount}
              showManagementBadges
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MapIcon}
          title={t("archivedEmptyTitle")}
          description={t("archivedEmptyDescription")}
          size="md"
        />
      )}
    </div>
  );
}
