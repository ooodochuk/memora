import { setRequestLocale } from "next-intl/server";
import { TripMomentFormScreen } from "@/components/dashboard/trip/trip-moment-form-screen";

interface EditEventPageProps {
  params: Promise<{ locale: string; id: string; eventId: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { locale, eventId } = await params;
  setRequestLocale(locale);

  return (
    <TripMomentFormScreen mode="edit" eventId={eventId} />
  );
}

export function generateStaticParams() {
  return [
    { id: "trip-ch", eventId: "event-ch-1-2" },
    { id: "trip-ch", eventId: "event-ch-3-2" },
    { id: "trip-pt", eventId: "event-pt-2-1" },
    { id: "trip-ua", eventId: "event-ua-2-1" },
    { id: "trip-fo", eventId: "event-fo-1-1" },
  ];
}
