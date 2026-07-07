"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import { dashboardRoutes } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/design-system/page-container";
import { QueryState } from "@/components/data-state/query-state";
import { useAdventure } from "@/features/adventures/hooks";
import { useEquipmentByAdventure } from "@/features/equipment/hooks";
import {
  TripDetailContent,
  TripHero,
  TripStats,
} from "@/components/dashboard/trip";
import { TripEquipmentSection } from "@/components/equipment";
import { adventureDtoToTrip, equipmentDtoToEquipment } from "@/lib/api-mappers";
import type { AppLocale } from "@/constants";

interface TripDetailPageClientProps {
  adventureId: string;
  locale: AppLocale;
}

export function TripDetailPageClient({
  adventureId,
  locale,
}: TripDetailPageClientProps) {
  const t = useTranslations("dashboard.pages.tripDetail");
  const adventureQuery = useAdventure(adventureId);
  const equipmentQuery = useEquipmentByAdventure(adventureId);

  return (
    <QueryState query={adventureQuery}>
      {(adventure) => (
        <>
          <PageContainer className="pt-4 pb-2">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 gap-1"
              render={<Link href={dashboardRoutes.trips()} />}
            >
              <ChevronLeft className="size-4" />
              {t("backToTrips")}
            </Button>
          </PageContainer>

          <TripHero trip={adventureDtoToTrip(adventure)} locale={locale} />

          <PageContainer className="space-y-8 pb-12 pt-6 sm:pt-8">
            <TripStats trip={adventureDtoToTrip(adventure)} cloudLinkCount={0} />
            <TripEquipmentSection
              tripId={adventureId}
              equipment={(equipmentQuery.data ?? []).map(equipmentDtoToEquipment)}
            />
            <TripDetailContent locale={locale} />
          </PageContainer>
        </>
      )}
    </QueryState>
  );
}
