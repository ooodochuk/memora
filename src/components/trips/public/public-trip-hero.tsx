import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Trip } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import { formatDateRange, getTripDuration } from "@/lib/format";
import { Eyebrow, Lead } from "@/components/design-system/typography";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

interface PublicTripHeroProps {
 trip: Trip;
 locale: AppLocale;
}

export async function PublicTripHero({ trip, locale }: PublicTripHeroProps) {
 const t = await getTranslations("trip");
 const duration = getTripDuration(trip.startDate, trip.endDate);

 return (
 <section className="relative">
 <div className="relative h-[58vh] min-h-[340px] max-h-[640px] overflow-hidden">
 <Image
 src={trip.coverImageUrl}
 alt={trip.title}
 fill
 priority
 className="object-cover"
 sizes="100vw"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
 </div>

 <div className="relative z-10 -mt-32 px-5 sm:-mt-36 sm:px-6 lg:px-10">
 <div className="mx-auto w-full max-w-screen-2xl space-y-6">
 <div className="space-y-4">
 <Eyebrow>{trip.subtitle}</Eyebrow>
 <h1 className="font-heading text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl">
 {trip.title}
 </h1>
 </div>

 <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground sm:text-base">
 <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
 <MapPin className="size-4 text-primary/80" aria-hidden />
 {trip.country}
 <span className="font-normal text-muted-foreground">·</span>
 {trip.region}
 </span>
 <span className="inline-flex items-center gap-1.5">
 <Calendar className="size-4 text-primary/80" aria-hidden />
 {formatDateRange(trip.startDate, trip.endDate, locale)}
 </span>
 <span>{t("duration", { count: duration })}</span>
 </div>

 <Lead className="max-w-3xl text-base leading-relaxed sm:text-lg">
 {trip.description}
 </Lead>

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
