import { getTranslations } from "next-intl/server";
import type { TripDay, TripEventWithRelations } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import { Heading } from "@/components/design-system/typography";
import { PublicTripDaysAccordion } from "@/components/trips/public/public-trip-days-accordion";

interface PublicTripTimelineProps {
 days: Array<{ day: TripDay; events: TripEventWithRelations[] }>;
 locale: AppLocale;
}

export async function PublicTripTimeline({
 days,
 locale,
}: PublicTripTimelineProps) {
 const t = await getTranslations("publicTrip.timeline");

 return (
 <section className="space-y-6">
 <Heading as="h2">{t("title")}</Heading>
 <PublicTripDaysAccordion days={days} locale={locale} />
 </section>
 );
}
