import { setRequestLocale } from "next-intl/server";
import { DashboardHomeClient } from "@/components/dashboard/home/dashboard-home-client";

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DashboardHomeClient />;
}
