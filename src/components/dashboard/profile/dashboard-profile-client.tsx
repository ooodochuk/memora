"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ExternalLink } from "lucide-react";
import { routes } from "@/constants/routes";
import { DashboardPageContent } from "@/components/dashboard/dashboard-page-content";
import { ProfileEditForm } from "@/components/dashboard/profile/profile-edit-form";
import { JournalCard } from "@/components/design-system/journal-card";
import { QueryState } from "@/components/data-state/query-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lead } from "@/components/design-system/typography";
import { Button } from "@/components/ui/button";
import { useCurrentProfile } from "@/features/auth/hooks";
import type { ProfileDto } from "@/features/auth/types";
import { getProfileInitials } from "@/lib/profile/display";

function ProfilePreview({ profile }: { profile: ProfileDto }) {
  const t = useTranslations("dashboard.pages.profile");
  const initials = getProfileInitials(profile.displayName);

  return (
    <JournalCard padding="lg" className="flex flex-col gap-6 sm:flex-row sm:items-start">
      <Avatar className="size-20 sm:size-24">
        <AvatarImage
          src={profile.avatarUrl ?? undefined}
          alt={profile.displayName}
        />
        <AvatarFallback className="text-lg">{initials}</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <h3 className="font-heading text-2xl font-medium">{profile.displayName}</h3>
        <p className="text-muted-foreground">@{profile.username}</p>
        {profile.tagline ? <Lead>{profile.tagline}</Lead> : null}
        {profile.bio ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>
        ) : null}
        {profile.location ? (
          <p className="text-sm text-muted-foreground">{profile.location}</p>
        ) : null}
        {profile.website ? (
          <a
            href={profile.website}
            className="text-sm text-primary underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {profile.website}
          </a>
        ) : null}
        <Button
          variant="outline"
          size="sm"
          className="mt-2 gap-1.5"
          render={
            <Link href={routes.profile(profile.username)} target="_blank" rel="noreferrer" />
          }
        >
          <ExternalLink className="size-3.5" />
          {t("viewPublicJournal")}
        </Button>
      </div>
    </JournalCard>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <JournalCard padding="lg" className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Skeleton className="size-20 rounded-full sm:size-24" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-48 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-16 w-full max-w-md rounded-md" />
        </div>
      </JournalCard>
      <JournalCard padding="lg" className="space-y-4">
        <Skeleton className="h-6 w-40 rounded-md" />
        <Skeleton className="h-24 w-full rounded-md" />
      </JournalCard>
    </div>
  );
}

export function DashboardProfileClient() {
  const t = useTranslations("dashboard.pages.profile");
  const profileQuery = useCurrentProfile();

  return (
    <DashboardPageContent title={t("title")} subtitle={t("subtitle")}>
      <QueryState query={profileQuery} loading={<ProfileSkeleton />}>
        {(profile) => (
          <div className="mx-auto max-w-3xl space-y-6">
            <ProfilePreview profile={profile} />
            <ProfileEditForm profile={profile} />
          </div>
        )}
      </QueryState>
    </DashboardPageContent>
  );
}
