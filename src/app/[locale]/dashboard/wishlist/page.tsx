import { setRequestLocale, getTranslations } from "next-intl/server";
import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content";
import { EmptyState } from "@/components/design-system/empty-state";
import { Sparkles } from "lucide-react";

interface WishlistPageProps {
  params: Promise<{ locale: string }>;
}

export default async function WishlistPage({ params }: WishlistPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dashboard.pages.wishlist");

  return (
    <DashboardPageContent title={t("title")} subtitle={t("subtitle")}>
      <EmptyState
        icon={Sparkles}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
        size="md"
      />
    </DashboardPageContent>
  );
}
