import { setRequestLocale } from "next-intl/server";
import { TripDayFormScreen } from "@/components/dashboard/trip/trip-day-form-screen";

interface EditDayPageProps {
  params: Promise<{ locale: string; id: string; dayId: string }>;
}

export default async function EditDayPage({ params }: EditDayPageProps) {
  const { locale, dayId } = await params;
  setRequestLocale(locale);

  return <TripDayFormScreen mode="edit" dayId={dayId} />;
}

export function generateStaticParams() {
  return [
    { id: "trip-ch", dayId: "day-ch-1" },
    { id: "trip-ch", dayId: "day-ch-2" },
    { id: "trip-pt", dayId: "day-pt-1" },
    { id: "trip-ua", dayId: "day-ua-1" },
    { id: "trip-fo", dayId: "day-fo-1" },
    { id: "trip-baltic", dayId: "day-baltic-1" },
  ];
}
