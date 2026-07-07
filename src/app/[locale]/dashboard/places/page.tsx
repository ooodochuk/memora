import { setRequestLocale, getTranslations } from "next-intl/server";
import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content";
import { EmptyState } from "@/components/design-system/empty-state";
import { MapPin } from "lucide-react";

interface PlacesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PlacesPage({ params }: PlacesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dashboard.pages.places");

  return (
    <DashboardPageContent title={t("title")} subtitle={t("subtitle")}>
      <EmptyState
        icon={MapPin}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
        size="md"
      />
    </DashboardPageContent>
  );
}
