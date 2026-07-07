import { setRequestLocale, getTranslations } from "next-intl/server";
import { SettingsPageClient } from "@/components/dashboard/settings/settings-page-client";

interface SettingsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SettingsPageClient />;
}
