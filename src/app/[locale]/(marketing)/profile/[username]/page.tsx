import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  formatProfileFallbackTitle,
  formatProfilePageTitle,
} from "@/lib/i18n/page-metadata";
import { getPublicProfileByUsername } from "@/lib/public-profile";
import { PageContainer } from "@/components/design-system/page-container";
import {
  PublicProfileHero,
  PublicProfileTravelStats,
  PublicTripsGrid,
} from "@/components/profile/public";

interface ProfilePageProps {
  params: Promise<{ locale: string; username: string }>;
}

export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale, username } = await params;
  setRequestLocale(locale);

  const data = await getPublicProfileByUsername(username);
  if (!data) notFound();

  const { profile, publicTrips, travelStats } = data;

  return (
    <>
      <PublicProfileHero profile={profile} locale={locale} />

      <PageContainer narrow className="space-y-5 py-4 sm:space-y-6 sm:py-5">
        <PublicProfileTravelStats travelStats={travelStats} />
        <PublicTripsGrid trips={publicTrips} username={profile.username} />
      </PageContainer>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; username: string }>;
}) {
  const { locale, username } = await params;
  const data = await getPublicProfileByUsername(username);

  if (!data) {
    return { title: await formatProfileFallbackTitle(locale) };
  }

  return {
    title: await formatProfilePageTitle(data.profile.displayName, locale),
    description: data.profile.bio || data.profile.tagline,
  };
}
