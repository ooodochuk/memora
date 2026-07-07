import { setRequestLocale } from "next-intl/server";
import { NewTripPageClient } from "@/components/dashboard/trip/new-trip-page-client";

interface NewTripPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewTripPage({ params }: NewTripPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <NewTripPageClient />;
}
