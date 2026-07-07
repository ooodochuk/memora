"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Profile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heading, Lead } from "@/components/design-system/typography";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { dashboardRoutes } from "@/constants/routes";
import { Plus } from "lucide-react";

interface DashboardWelcomeProps {
  profile: Profile;
}

export function DashboardWelcome({ profile }: DashboardWelcomeProps) {
  const t = useTranslations("dashboard.pages.home");
  const tHeader = useTranslations("dashboard.header");

  const initials = profile.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <section className="surface-card relative overflow-hidden border border-border/50">
      <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4 sm:items-center">
          <Avatar className="size-16 border-2 border-background shadow-sm sm:size-20">
            <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
            <AvatarFallback className="font-heading text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Heading as="h1" className="text-3xl sm:text-4xl">
              {t("greeting", { name: profile.displayName.split(" ")[0] })}
            </Heading>
            <Lead className="max-w-md text-sm sm:text-base">
              {profile.tagline?.trim() || t("greetingNote")}
            </Lead>
          </div>
        </div>
        <Button
          variant="warm"
          size="lg"
          className="shrink-0 self-start sm:self-center"
          render={<Link href={dashboardRoutes.newTrip()} />}
        >
          <Plus className="size-4" />
          {tHeader("createTrip")}
        </Button>
      </div>
      {profile.coverUrl && (
        <div className="relative h-24 overflow-hidden border-t border-border sm:h-28">
          <Image
            src={profile.coverUrl}
            alt=""
            fill
            className="object-cover opacity-40 saturate-[0.85]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}
    </section>
  );
}
