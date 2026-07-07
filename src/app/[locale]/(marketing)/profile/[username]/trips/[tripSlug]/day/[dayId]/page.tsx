import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/container";
import { TripEventCard } from "@/components/trips/trip-event-card";
import { DayActivityList } from "@/components/day-activities";
import { EmptyState } from "@/components/design-system/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotebookPen } from "lucide-react";
import {
 getProfileByUsername,
 getTripBySlug,
 getDaysByTripId,
 getDayById,
 getEventsWithRelationsByDayId,
} from "@/lib/mock-data";
import { routes } from "@/constants/routes";
import { formatDate } from "@/lib/format";
import type { AppLocale } from "@/i18n/routing";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DayPageProps {
 params: Promise<{
 locale: string;
 username: string;
 tripSlug: string;
 dayId: string;
 }>;
}

export default async function DayPage({ params }: DayPageProps) {
 const { locale, username, tripSlug, dayId } = await params;
 setRequestLocale(locale);

 const profile = getProfileByUsername(username);
 const trip = getTripBySlug(tripSlug);
 const day = getDayById(dayId);

 if (!profile || !trip || !day || trip.ownerId !== profile.id || day.tripId !== trip.id) {
 notFound();
 }

 const days = getDaysByTripId(trip.id);
 const currentIndex = days.findIndex((d) => d.id === dayId);
 const prevDay = currentIndex > 0 ? days[currentIndex - 1] : null;
 const nextDay =
 currentIndex < days.length - 1 ? days[currentIndex + 1] : null;
 const events = getEventsWithRelationsByDayId(day.id);

 const t = await getTranslations("day");
 const tTrip = await getTranslations("trip");
 const tCommon = await getTranslations("common");
 const dayTitle = (item: typeof day) =>
 item.title ?? tTrip("dayLabel", { number: item.dayNumber });
 const appLocale = locale as AppLocale;

 return (
 <Container className="py-8 sm:py-12">
 <div className="mb-8 space-y-4">
 <Button
 variant="ghost"
 size="sm"
 className="gap-1 -ml-2"
 render={<Link href={routes.trip(username, tripSlug)} />}
 >
 <ChevronLeft className="size-4" />
 {t("backToTrip")}
 </Button>

 <div className="space-y-3">
 <div className="flex flex-wrap items-center gap-2">
 <Badge variant="secondary">
 {tTrip("dayLabel", { number: day.dayNumber })}
 </Badge>
 <span className="text-sm text-muted-foreground">
 {formatDate(day.date, appLocale, {
 weekday: "long",
 month: "long",
 day: "numeric",
 year: "numeric",
 })}
 </span>
 </div>
 <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
 {dayTitle(day)}
 </h1>
 {(day.activities?.length ?? 0) > 0 && (
 <DayActivityList activities={day.activities} size="md" />
 )}
 {day.summary && (
 <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
 {day.summary}
 </p>
 )}
 </div>
 </div>

 <section className="space-y-2">
 <h2 className="mb-6 font-heading text-xl font-medium">
 {t("moments")}{" "}
 <span className="text-base font-normal text-muted-foreground">
 ({tCommon("events", { count: events.length })})
 </span>
 </h2>

 {events.length === 0 ? (
 <EmptyState
 icon={NotebookPen}
 title={t("noEvents")}
 description={t("noEventsDescription")}
 />
 ) : (
 <div>
 {events.map((event, index) => (
 <TripEventCard
 key={event.id}
 event={event}
 locale={appLocale}
 isLast={index === events.length - 1}
 />
 ))}
 </div>
 )}
 </section>

 <nav className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-8 sm:flex-row sm:justify-between">
 {prevDay ? (
 <Button
 variant="outline"
 className="justify-start gap-2"
 render={
 <Link
 href={routes.tripDay(username, tripSlug, prevDay.id)}
 />
 }
 >
 <ChevronLeft className="size-4" />
 <span>
 {t("previousDay")}: {dayTitle(prevDay)}
 </span>
 </Button>
 ) : (
 <div />
 )}
 {nextDay && (
 <Button
 variant="outline"
 className="justify-end gap-2 sm:ml-auto"
 render={
 <Link
 href={routes.tripDay(username, tripSlug, nextDay.id)}
 />
 }
 >
 <span>
 {t("nextDay")}: {dayTitle(nextDay)}
 </span>
 <ChevronRight className="size-4" />
 </Button>
 )}
 </nav>
 </Container>
 );
}

export function generateStaticParams() {
 return [
 {
 username: "oksana",
 tripSlug: "switzerland-bikepacking",
 dayId: "day-ch-1",
 },
 {
 username: "oksana",
 tripSlug: "switzerland-bikepacking",
 dayId: "day-ch-3",
 },
 {
 username: "oksana",
 tripSlug: "portugal-active",
 dayId: "day-pt-1",
 },
 {
 username: "oksana",
 tripSlug: "portugal-active",
 dayId: "day-pt-3",
 },
 {
 username: "oksana",
 tripSlug: "carpathians-hiking",
 dayId: "day-ua-2",
 },
 {
 username: "oksana",
 tripSlug: "faroe-islands",
 dayId: "day-fo-1",
 },
 ];
}
