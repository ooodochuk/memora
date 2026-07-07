"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import { useCurrentProfile } from "@/features/auth/hooks";
import { useAuth } from "@/providers/auth-provider";
import { routes, dashboardRoutes } from "@/constants/routes";
import { PageSection } from "@/components/design-system/page-container";
import { SectionHeading } from "@/components/layout/section-heading";
import { JournalCard } from "@/components/design-system/journal-card";
import { Heading, Lead } from "@/components/design-system/typography";
import { IconBadge } from "@/components/design-system/icon-badge";
import { Button } from "@/components/ui/button";

export function HomeExploreSection() {
  const t = useTranslations("home");
  const { isReady, isAuthenticated } = useAuth();
  const { data: profile } = useCurrentProfile();

  return (
    <PageSection id="explore" spacing="md">
      <div className="space-y-10">
        <SectionHeading
          title={
            isAuthenticated ? t("member.exploreTitle") : t("guest.exploreTitle")
          }
          subtitle={
            isAuthenticated
              ? t("member.exploreDescription")
              : t("guest.exploreDescription")
          }
        />

        {!isReady ? (
          <div className="h-40" aria-hidden />
        ) : isAuthenticated && profile?.username ? (
          <JournalCard padding="lg" className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <IconBadge
                icon={BookOpen}
                size="md"
                className="bg-muted/80 text-primary"
              />
              <div className="space-y-2">
                <Heading as="h3">{profile.displayName}</Heading>
                <Lead className="text-sm text-muted-foreground">
                  @{profile.username}
                </Lead>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="warm"
                render={<Link href={routes.profile(profile.username)} />}
              >
                {t("member.journalCta")}
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                render={<Link href={dashboardRoutes.home()} />}
              >
                {t("member.dashboardCta")}
              </Button>
            </div>
          </JournalCard>
        ) : (
          <JournalCard padding="lg" className="mx-auto max-w-2xl space-y-6 text-center">
            <IconBadge
              icon={BookOpen}
              size="md"
              className="mx-auto bg-muted/80 text-primary"
            />
            <div className="space-y-3">
              <Heading as="h3">{t("guest.exploreCardTitle")}</Heading>
              <Lead className="text-muted-foreground">
                {t("guest.exploreCardDescription")}
              </Lead>
            </div>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" variant="warm" render={<Link href="/register" />}>
                {t("guest.signUpCta")}
                <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/login" />}>
                {t("guest.signInCta")}
              </Button>
            </div>
          </JournalCard>
        )}
      </div>
    </PageSection>
  );
}
