import { setRequestLocale } from "next-intl/server";
import { NewEquipmentPageClient } from "@/components/dashboard/equipment/new-equipment-page-client";

interface NewEquipmentPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewEquipmentPage({ params }: NewEquipmentPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <NewEquipmentPageClient />;
}
