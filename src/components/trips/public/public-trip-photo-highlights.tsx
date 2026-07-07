import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Photo } from "@/types";
import { SectionHeader } from "@/components/design-system/section-header";
import { cn } from "@/lib/utils";

const HIGHLIGHT_LIMIT = 6;

interface PublicTripPhotoHighlightsProps {
 photos: Photo[];
}

export async function PublicTripPhotoHighlights({
 photos,
}: PublicTripPhotoHighlightsProps) {
 const t = await getTranslations("publicTrip.photos");
 const highlights = photos.slice(0, HIGHLIGHT_LIMIT);

 if (highlights.length === 0) return null;

 return (
 <section className="space-y-8">
 <SectionHeader
 eyebrow={t("eyebrow")}
 title={t("title")}
 subtitle={t("subtitle", { count: photos.length })}
 divider
 />

 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {highlights.map((photo, index) => (
 <figure
 key={photo.id}
 className={cn(
 "group overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
 index === 0 && highlights.length > 2 && "sm:col-span-2 lg:row-span-2",
 )}
 >
 <div
 className={cn(
 "relative overflow-hidden bg-muted",
 index === 0 && highlights.length > 2
 ? "aspect-[16/10] sm:aspect-auto sm:min-h-[320px]"
 : "aspect-[4/3]",
 )}
 >
 <Image
 src={photo.url}
 alt={photo.alt}
 fill
 className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
 sizes={
 index === 0
 ? "(max-width: 1024px) 100vw, 66vw"
 : "(max-width: 768px) 100vw, 33vw"
 }
 />
 </div>
 {photo.caption && (
 <figcaption className="px-4 py-3 text-sm leading-relaxed text-muted-foreground">
 {photo.caption}
 </figcaption>
 )}
 </figure>
 ))}
 </div>
 </section>
 );
}
