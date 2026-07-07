import { setRequestLocale } from "next-intl/server";
import { TripDayFormScreen } from "@/components/dashboard/trip/trip-day-form-screen";

interface NewDayPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function NewDayPage({ params }: NewDayPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TripDayFormScreen mode="create" />;
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
