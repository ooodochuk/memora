import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageSection } from "@/components/design-system/page-container";
import { Eyebrow, Heading, Lead } from "@/components/design-system/typography";
import { IconBadge } from "@/components/design-system/icon-badge";
import { JournalCard } from "@/components/design-system/journal-card";
import { GuestAuthRedirect } from "@/components/auth/guest-auth-redirect";
import { HomeHeroActions } from "@/components/marketing/home-hero-actions";
import { HomeExploreSection } from "@/components/marketing/home-explore-section";
import { BookOpen, Camera, Globe2 } from "lucide-react";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  const features = [
    {
      icon: BookOpen,
      title: t("features.journal.title"),
      description: t("features.journal.description"),
    },
    {
      icon: Camera,
      title: t("features.visual.title"),
      description: t("features.visual.description"),
    },
    {
      icon: Globe2,
      title: t("features.portfolio.title"),
      description: t("features.portfolio.description"),
    },
  ];

  return (
    <GuestAuthRedirect loadingClassName="min-h-[60vh]">
      <>
        <section className="relative min-h-[78vh] overflow-hidden film-grain">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-background" />
        <div className="photo-vignette absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/55 to-background" />

        <div className="relative flex min-h-[78vh] flex-col items-center justify-end px-5 pb-16 pt-32 text-center sm:px-6 sm:pb-24 lg:px-10">
          <div className="mx-auto max-w-3xl space-y-8">
            <Eyebrow className="tracking-[0.32em] text-primary/90">
              {t("hero.eyebrow")}
            </Eyebrow>
            <Heading as="h1" className="mx-auto text-foreground">
              {t("hero.title")}
            </Heading>
            <Lead className="mx-auto max-w-2xl">{t("hero.subtitle")}</Lead>
            <HomeHeroActions />
          </div>
        </div>
      </section>

      <HomeExploreSection />

      <PageSection spacing="md" className="border-t border-border">
        <div className="space-y-12">
          <div className="mx-auto space-y-3 text-center">
            <Heading as="h2">{t("features.title")}</Heading>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <JournalCard key={title} padding="md" className="space-y-4">
                <IconBadge
                  icon={Icon}
                  size="md"
                  className="bg-muted/80 text-primary"
                />
                <Heading as="h3">{title}</Heading>
                <Lead className="text-sm text-muted-foreground">
                  {description}
                </Lead>
              </JournalCard>
            ))}
          </div>
        </div>
      </PageSection>

      <div className="px-5 py-12 text-center sm:px-6 lg:px-10">
        <p className="text-sm tracking-wide text-muted-foreground">
          {tCommon("appName")} — {tCommon("tagline")}
        </p>
      </div>
      </>
    </GuestAuthRedirect>
  );
}
