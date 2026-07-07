import { setRequestLocale, getTranslations } from "next-intl/server";
import { AppShell } from "@/components/dashboard/app-shell";
import { DashboardAuthGuard } from "@/components/auth/dashboard-auth-guard";
import { formatPageTitle } from "@/lib/i18n/page-metadata";

interface DashboardLayoutProps {
 children: React.ReactNode;
 params: Promise<{ locale: string }>;
}

export default async function DashboardLayout({
 children,
 params,
}: DashboardLayoutProps) {
 const { locale } = await params;
 setRequestLocale(locale);

 return (
  <DashboardAuthGuard>
   <AppShell>{children}</AppShell>
  </DashboardAuthGuard>
 );
}

export async function generateMetadata({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 const t = await getTranslations({ locale, namespace: "dashboard.pages.dashboard" });

 return {
 title: await formatPageTitle(t("title"), locale),
 };
}
