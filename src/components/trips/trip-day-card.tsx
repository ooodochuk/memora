import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { TripDay } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import { routes } from "@/constants/routes";
import { formatDate } from "@/lib/format";
import { getEventsByDayId } from "@/lib/mock-data";
import { DayActivityList } from "@/components/day-activities";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface TripDayCardProps {
 day: TripDay;
 username: string;
 tripSlug: string;
 locale: AppLocale;
}

export async function TripDayCard({
 day,
 username,
 tripSlug,
 locale,
}: TripDayCardProps) {
 const t = await getTranslations("trip");
 const tCommon = await getTranslations("common");
 const events = getEventsByDayId(day.id);
 const dayTitle = day.title ?? t("dayLabel", { number: day.dayNumber });

 return (
 <Link
 href={routes.tripDay(username, tripSlug, day.id)}
 className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm motion-safe:transition-[border-color,box-shadow] motion-safe:duration-300 hover:border-border hover:shadow-md sm:flex-row"
 >
 {day.coverImageUrl && (
 <div className="relative aspect-[16/10] shrink-0 sm:w-48 md:w-56">
 <Image
 src={day.coverImageUrl}
 alt={dayTitle}
 fill
 className="object-cover transition-transform duration-500 group-hover:scale-105"
 sizes="224px"
 />
 </div>
 )}

 <div className="flex flex-1 flex-col justify-between gap-4 p-5 sm:p-6">
 <div className="space-y-2">
 <div className="flex flex-wrap items-center gap-2">
 <Badge variant="secondary">{t("dayLabel", { number: day.dayNumber })}</Badge>
 <span className="text-xs text-muted-foreground">
 {formatDate(day.date, locale, {
 weekday: "long",
 month: "short",
 day: "numeric",
 })}
 </span>
 </div>
 <h3 className="font-heading text-xl font-medium tracking-tight group-hover:text-primary transition-colors">
 {dayTitle}
 </h3>
 {(day.activities?.length ?? 0) > 0 && (
 <DayActivityList activities={day.activities} />
 )}
 {day.summary && (
 <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
 {day.summary}
 </p>
 )}
 </div>

 <div className="flex items-center justify-between text-sm">
 <span className="text-muted-foreground">
 {tCommon("events", { count: events.length })}
 </span>
 <span className="inline-flex items-center gap-1 font-medium text-primary opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
 {t("viewDay")}
 <ArrowRight className="size-4" />
 </span>
 </div>
 </div>
 </Link>
 );
}
