import { setRequestLocale } from "next-intl/server";
import { TripDetailPageClient } from "@/components/dashboard/trip/trip-detail-page-client";
import type { AppLocale } from "@/constants";

interface TripDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <TripDetailPageClient adventureId={id} locale={locale as AppLocale} />;
}
