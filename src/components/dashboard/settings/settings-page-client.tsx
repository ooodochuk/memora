"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { dashboardRoutes, routes } from "@/constants/routes";
import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content";
import { JournalCard } from "@/components/design-system/journal-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCurrentProfile, useCurrentUser, useLogout } from "@/features/auth/hooks";

function SettingsSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <JournalCard padding="lg" className="space-y-3">
        <Skeleton className="h-6 w-40 rounded-md" />
        <Skeleton className="h-4 w-full max-w-sm rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </JournalCard>
    </div>
  );
}

export function SettingsPageClient() {
  const t = useTranslations("dashboard.pages.settings");
  const userQuery = useCurrentUser();
  const profileQuery = useCurrentProfile();
  const logout = useLogout();
  const router = useRouter();

  const isLoading = userQuery.isLoading || profileQuery.isLoading;

  if (isLoading) {
    return (
      <DashboardPageContent title={t("title")} subtitle={t("subtitle")}>
        <SettingsSkeleton />
      </DashboardPageContent>
    );
  }

  const failedQuery = userQuery.isError ? userQuery : profileQuery.isError ? profileQuery : null;

  if (failedQuery) {
    return (
      <DashboardPageContent title={t("title")} subtitle={t("subtitle")}>
        <p className="text-sm text-destructive">{t("loadError")}</p>
      </DashboardPageContent>
    );
  }

  const user = userQuery.data;
  const profile = profileQuery.data;

  if (!user || !profile) {
    return null;
  }

  async function handleLogout() {
    await logout.mutateAsync();
    router.replace("/login");
  }

  return (
    <DashboardPageContent title={t("title")} subtitle={t("subtitle")}>
      <div className="mx-auto max-w-2xl space-y-6">
        <JournalCard padding="lg" className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-medium">{t("account.title")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("account.description")}</p>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">{t("account.email")}</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("account.username")}</dt>
              <dd className="font-medium">@{profile.username}</dd>
            </div>
          </dl>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            render={<Link href={dashboardRoutes.profile()} />}
          >
            {t("account.editProfile")}
          </Button>
        </JournalCard>

        <JournalCard padding="lg" className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-medium">{t("journal.title")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("journal.description")}</p>
          </div>
          <Button
            variant="warm"
            size="sm"
            className="gap-1.5"
            render={
              <Link href={routes.profile(profile.username)} target="_blank" rel="noreferrer" />
            }
          >
            <ExternalLink className="size-3.5" />
            {t("journal.viewPublic")}
          </Button>
        </JournalCard>

        <JournalCard padding="lg" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-lg font-medium">{t("session.title")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("session.description")}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="gap-1.5"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            <LogOut className="size-3.5" />
            {t("session.logout")}
          </Button>
        </JournalCard>
      </div>
    </DashboardPageContent>
  );
}
