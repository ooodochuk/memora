import { setRequestLocale } from "next-intl/server";
import { EquipmentPageClient } from "@/components/dashboard/equipment/equipment-page-client";

interface EquipmentPageProps {
 params: Promise<{ locale: string }>;
}

export default async function EquipmentPage({ params }: EquipmentPageProps) {
 const { locale } = await params;
 setRequestLocale(locale);

 return <EquipmentPageClient />;
}
