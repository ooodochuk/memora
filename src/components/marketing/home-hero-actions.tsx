"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useCurrentProfile } from "@/features/auth/hooks";
import { useAuth } from "@/providers/auth-provider";
import { routes } from "@/constants/routes";
import { Button } from "@/components/ui/button";

export function HomeHeroActions() {
  const t = useTranslations("home.hero");
  const { isReady, isAuthenticated } = useAuth();
  const { data: profile } = useCurrentProfile();

  if (!isReady) {
    return <div className="h-11" aria-hidden />;
  }

  if (isAuthenticated && profile?.username) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
        <Button
          size="lg"
          variant="warm"
          render={<Link href={routes.profile(profile.username)} />}
        >
          {t("cta")}
          <ArrowRight className="size-4" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-border bg-foreground/5 hover:bg-foreground/10"
          render={<Link href="#explore" />}
        >
          {t("secondaryCta")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
      <Button size="lg" variant="warm" render={<Link href="/register" />}>
        {t("ctaGuest")}
        <ArrowRight className="size-4" />
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="border-border bg-foreground/5 hover:bg-foreground/10"
        render={<Link href="/login" />}
      >
        {t("signInCta")}
      </Button>
    </div>
  );
}
