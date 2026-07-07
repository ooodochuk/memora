import { setRequestLocale } from "next-intl/server";
import { EditEquipmentPageClient } from "@/components/dashboard/equipment/edit-equipment-page-client";

interface EditEquipmentPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditEquipmentPage({ params }: EditEquipmentPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <EditEquipmentPageClient equipmentId={id} />;
}
