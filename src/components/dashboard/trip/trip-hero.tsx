import { CoverImage } from "@/components/design-system/cover-image";
import type { Trip } from "@/types";
import type { AppLocale } from "@/i18n/routing";
import { formatDateRange } from "@/lib/format";
import { Eyebrow, Lead } from "@/components/design-system/typography";
import {
 StatusBadge,
 VisibilityBadge,
} from "@/components/design-system/status-badge";
import { Calendar, MapPin } from "lucide-react";

interface TripHeroProps {
 trip: Trip;
 locale: AppLocale;
}

export function TripHero({ trip, locale }: TripHeroProps) {
 return (
 <section className="relative film-grain">
 <div className="relative h-[52vh] min-h-[320px] max-h-[640px] overflow-hidden">
 <CoverImage
 src={trip.coverImageUrl}
 alt={trip.title}
 className="h-full w-full"
 priority
 sizes="100vw"
 />
 <div className="photo-vignette absolute inset-0" />
 <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
 </div>

 <div className="relative z-10 -mt-32 px-5 sm:-mt-36 sm:px-6 lg:px-10">
 <div className="mx-auto w-full max-w-screen-2xl space-y-5">
 <div className="flex flex-wrap items-center gap-2">
 <StatusBadge status={trip.status} size="md" />
 <VisibilityBadge visibility={trip.visibility} size="md" />
 </div>

 <div className="max-w-3xl space-y-4">
 <Eyebrow className="text-primary/90">{trip.subtitle}</Eyebrow>
 <h1 className="font-heading text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl">
 {trip.title}
 </h1>
 <Lead className="text-base sm:text-lg">
 {trip.description}
 </Lead>
 </div>

 <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
 <span className="inline-flex items-center gap-1.5">
 <MapPin className="size-4 text-primary/90" />
 <span className="font-medium text-foreground">{trip.country}</span>
 <span className="text-muted-foreground/60">·</span>
 <span>{trip.region}</span>
 </span>
 <span className="inline-flex items-center gap-1.5">
 <Calendar className="size-4 text-primary/90" />
 {formatDateRange(trip.startDate, trip.endDate, locale)}
 </span>
 </div>
 </div>
 </div>
 </section>
 );
}
