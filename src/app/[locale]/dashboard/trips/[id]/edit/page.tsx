import { setRequestLocale } from "next-intl/server";
import { EditTripPageClient } from "@/components/dashboard/trip/edit-trip-page-client";

interface EditTripPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditTripPage({ params }: EditTripPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <EditTripPageClient adventureId={id} />;
}
