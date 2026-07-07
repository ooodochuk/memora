import { redirect } from "@/i18n/navigation";
import { dashboardRoutes } from "@/constants/routes";

interface EquipmentDetailRedirectPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EquipmentDetailRedirectPage({
  params,
}: EquipmentDetailRedirectPageProps) {
  const { locale } = await params;
  redirect({ href: dashboardRoutes.equipment(), locale });
}
