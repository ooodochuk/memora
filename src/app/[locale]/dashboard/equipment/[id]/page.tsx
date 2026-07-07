import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, Pencil } from "lucide-react";
import type { AppLocale } from "@/i18n/routing";
import { dashboardRoutes } from "@/constants/routes";
import {
 getEquipmentById,
 getEquipmentUsageCount,
 getEquipmentNightsUsed,
 getTripsUsingEquipment,
} from "@/lib/equipment/accessors";
import {
 getEquipmentCategoryById,
} from "@/lib/equipment/category-accessors";
import {
 formatPrice,
 formatWeightGrams,
 getEquipmentCategoryLabel,
} from "@/lib/equipment/categories";
import { EquipmentIconGlyph } from "@/components/equipment/equipment-icon-glyph";
import { formatDateRange } from "@/lib/format";
import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content";
import { JournalCard } from "@/components/design-system/journal-card";
import { MetaText } from "@/components/design-system/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/design-system/page-container";

interface EquipmentDetailPageProps {
 params: Promise<{ locale: string; id: string }>;
}

export default async function EquipmentDetailPage({
 params,
}: EquipmentDetailPageProps) {
 const { locale, id } = await params;
 setRequestLocale(locale);

 const item = getEquipmentById(id);
 if (!item) notFound();

 const t = await getTranslations("dashboard.pages.equipmentDetail");
 const tDefault = await getTranslations("equipment.defaultCategories");
 const tEquipment = await getTranslations("dashboard.equipment");
 const appLocale = locale as AppLocale;

 const category = getEquipmentCategoryById(item.categoryId);
 const categoryLabel = category
 ? getEquipmentCategoryLabel(category, tDefault)
 : null;
 const tripCount = getEquipmentUsageCount(item.id);
 const nightsUsed = getEquipmentNightsUsed(item.id);
 const usedOnTrips = getTripsUsingEquipment(item.id);

 return (
 <>
 <PageContainer className="pt-4 pb-2">
 <Button
 variant="ghost"
 size="sm"
 className="-ml-2 gap-1"
 render={<Link href={dashboardRoutes.equipment()} />}
 >
 <ChevronLeft className="size-4" />
 {t("backToEquipment")}
 </Button>
 </PageContainer>

 <DashboardPageContent
 title={item.name}
 subtitle={`${item.brand} · ${item.model}`}
 eyebrow={categoryLabel ?? undefined}
 action={
 <Button
 variant="outline"
 size="sm"
 className="gap-1.5"
 render={<Link href={dashboardRoutes.editEquipment(item.id)} />}
 >
 <Pencil className="size-3.5" />
 {t("edit")}
 </Button>
 }
 >
 <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
 <JournalCard className="overflow-hidden">
 <div className="relative aspect-[16/10] bg-muted">
 {item.photoUrl ? (
 <Image
 src={item.photoUrl}
 alt={item.name}
 fill
 className="object-cover"
 sizes="(max-width: 1024px) 100vw, 60vw"
 priority
 />
 ) : (
 <div className="flex h-full items-center justify-center bg-muted/40">
 <EquipmentIconGlyph
 icon={category?.icon ?? "Package"}
 className="size-16 text-primary/60"
 strokeWidth={1.1}
 />
 </div>
 )}
 </div>
 <div className="space-y-4 p-5 sm:p-6">
 <div className="flex flex-wrap gap-2">
 <Badge variant={item.isActive ? "warm" : "secondary"}>
 {item.isActive
 ? tEquipment("status.active")
 : tEquipment("status.inactive")}
 </Badge>
 {categoryLabel && (
 <Badge variant="outline">{categoryLabel}</Badge>
 )}
 </div>
 {item.notes && (
 <p className="text-sm leading-relaxed text-muted-foreground">
 {item.notes}
 </p>
 )}
 </div>
 </JournalCard>

 <div className="space-y-4">
 <JournalCard padding="md" className="space-y-4">
 <h2 className="font-heading text-lg font-medium">{t("specsTitle")}</h2>
 <dl className="grid gap-3 text-sm">
 <div className="flex justify-between gap-4 border-b border-border pb-3">
 <dt className="text-muted-foreground">{t("weight")}</dt>
 <dd className="font-medium tabular-nums">
 {formatWeightGrams(item.weightGrams)}
 </dd>
 </div>
 {item.purchaseDate && (
 <div className="flex justify-between gap-4 border-b border-border pb-3">
 <dt className="text-muted-foreground">{t("purchaseDate")}</dt>
 <dd className="font-medium">{item.purchaseDate}</dd>
 </div>
 )}
 {item.purchasePrice != null && (
 <div className="flex justify-between gap-4 border-b border-border pb-3">
 <dt className="text-muted-foreground">{t("purchasePrice")}</dt>
 <dd className="font-medium">
 {formatPrice(item.purchasePrice, appLocale)}
 </dd>
 </div>
 )}
 <div className="flex justify-between gap-4">
 <dt className="text-muted-foreground">{t("tripsUsed")}</dt>
 <dd className="font-medium tabular-nums">{tripCount}</dd>
 </div>
 <div className="flex justify-between gap-4">
 <dt className="text-muted-foreground">{t("nightsUsed")}</dt>
 <dd className="font-medium tabular-nums">{nightsUsed}</dd>
 </div>
 </dl>
 </JournalCard>

 <JournalCard padding="md" className="space-y-4">
 <h2 className="font-heading text-lg font-medium">{t("usedOnTrips")}</h2>
 {usedOnTrips.length === 0 ? (
 <p className="text-sm text-muted-foreground">{t("noTrips")}</p>
 ) : (
 <ul className="space-y-2">
 {usedOnTrips.map((trip) => (
 <li key={trip.id}>
 <Link
 href={dashboardRoutes.trip(trip.id)}
 className="block rounded-xl border border-border px-4 py-3 transition-colors hover:border-border hover:bg-muted/50"
 >
 <p className="font-medium">{trip.title}</p>
 <MetaText>
 {formatDateRange(
 trip.startDate,
 trip.endDate,
 appLocale,
 )}
 </MetaText>
 </Link>
 </li>
 ))}
 </ul>
 )}
 </JournalCard>
 </div>
 </div>
 </DashboardPageContent>
 </>
 );
}

export function generateStaticParams() {
 return [
 { id: "eq-tent" },
 { id: "eq-sleeping-bag" },
 { id: "eq-bike" },
 { id: "eq-drone" },
 { id: "eq-gps" },
 ];
}
