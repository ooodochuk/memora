import { setRequestLocale } from "next-intl/server";
import { DashboardProfileClient } from "@/components/dashboard/profile/dashboard-profile-client";

interface DashboardProfilePageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardProfilePage({
  params,
}: DashboardProfilePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DashboardProfileClient />;
}
