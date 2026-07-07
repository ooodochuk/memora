import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Trip } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import { formatDateRange, getTripDuration } from "@/lib/format";
import { Eyebrow, Heading, Lead, MetaText } from "@/components/design-system/typography";
import {
 StatusBadge,
 VisibilityBadge,
} from "@/components/design-system/status-badge";
import { Badge } from "@/components/ui/badge";
import { Calendar, Globe } from "lucide-react";

interface TripHeroProps {
 trip: Trip;
 locale: AppLocale;
}

export async function TripHero({ trip, locale }: TripHeroProps) {
 const t = await getTranslations("trip");
 const duration = getTripDuration(trip.startDate, trip.endDate);

 return (
 <section className="relative">
 <div className="relative h-[52vh] min-h-[300px] max-h-[580px] overflow-hidden">
 <Image
 src={trip.coverImageUrl}
 alt={trip.title}
 fill
 priority
 className="object-cover"
 sizes="100vw"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
 </div>

 <div className="relative z-10 -mt-28 px-5 sm:-mt-32 sm:px-6 lg:px-10">
 <div className="mx-auto w-full max-w-screen-2xl space-y-6">
 <div className="max-w-3xl space-y-5">
 <div className="flex flex-wrap items-center gap-2">
 {trip.status !== "published" && (
 <StatusBadge status={trip.status} size="md" />
 )}
 <VisibilityBadge visibility={trip.visibility} size="md" />
 </div>
 <Eyebrow>{trip.subtitle}</Eyebrow>
 <Heading as="h1">{trip.title}</Heading>
 <Lead>{trip.description}</Lead>
 </div>

 <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
 <MetaText className="inline-flex items-center gap-1.5">
 <Calendar className="size-3.5 text-primary/80" />
 {formatDateRange(trip.startDate, trip.endDate, locale)}
 </MetaText>
 <MetaText>{t("duration", { count: duration })}</MetaText>
 <MetaText className="inline-flex items-center gap-1.5">
 <Globe className="size-3.5 text-primary/80" />
 {trip.country} · {trip.region}
 </MetaText>
 </div>

 <div className="flex flex-wrap gap-2">
 {trip.tags.map((tag) => (
 <Badge key={tag} variant="tag" size="sm">
 #{tag}
 </Badge>
 ))}
 </div>
 </div>
 </div>
 </section>
 );
}
