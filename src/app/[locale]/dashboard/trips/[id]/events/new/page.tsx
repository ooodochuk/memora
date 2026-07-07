import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { dashboardRoutes } from "@/constants/routes";
import { TripMomentFormScreen } from "@/components/dashboard/trip/trip-moment-form-screen";

interface NewEventPageProps {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ dayId?: string }>;
}

export default async function NewEventPage({
  params,
  searchParams,
}: NewEventPageProps) {
  const { locale, id } = await params;
  const { dayId } = await searchParams;
  setRequestLocale(locale);

  if (!dayId) {
    redirect(dashboardRoutes.trip(id));
  }

  return <TripMomentFormScreen mode="create" dayId={dayId} />;
}

export function generateStaticParams() {
  return [
    { id: "trip-ch" },
    { id: "trip-pt" },
    { id: "trip-ua" },
    { id: "trip-fo" },
    { id: "trip-baltic" },
  ];
}
