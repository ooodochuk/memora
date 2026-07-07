import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import {
  formatTripFallbackTitle,
  formatTripPageTitle,
} from "@/lib/i18n/page-metadata";
import { getPublicTripPageData } from "@/lib/public-trip";
import { routes } from "@/constants/routes";
import { PageContainer } from "@/components/design-system/page-container";
import {
  PublicTripAuthorFooter,
  PublicTripCloudContent,
  PublicTripHero,
  PublicTripPhotoHighlights,
  PublicTripStats,
  PublicTripTimeline,
} from "@/components/trips/public";
import { Button } from "@/components/ui/button";
import type { AppLocale } from "@/i18n/routing";

interface TripPageProps {
  params: Promise<{ locale: string; username: string; tripSlug: string }>;
}

export const dynamic = "force-dynamic";

export default async function TripPage({ params }: TripPageProps) {
  const { locale, username, tripSlug } = await params;
  setRequestLocale(locale);

  const data = await getPublicTripPageData(username, tripSlug);
  if (!data) notFound();

  const { profile, trip, timelineDays, photos, cloudLinks, mediaLinks } = data;
  const appLocale = locale as AppLocale;

  return (
    <>
      <PageContainer className="pt-4 pb-2">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 gap-1"
          render={<Link href={routes.profile(username)} />}
        >
          <ChevronLeft className="size-4" />
          {profile.displayName}
        </Button>
      </PageContainer>

      <PublicTripHero trip={trip} locale={appLocale} />

      <PageContainer className="space-y-16 py-12 sm:space-y-20 sm:py-16">
        <PublicTripStats trip={trip} cloudLinkCount={cloudLinks.length} />

        <PublicTripTimeline days={timelineDays} locale={appLocale} />

        <PublicTripPhotoHighlights photos={photos} />

        <PublicTripCloudContent
          mediaLinks={mediaLinks}
          allLinks={cloudLinks}
        />

        <PublicTripAuthorFooter profile={profile} />
      </PageContainer>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; username: string; tripSlug: string }>;
}) {
  const { locale, username, tripSlug } = await params;
  const data = await getPublicTripPageData(username, tripSlug);

  if (!data) {
    return { title: await formatTripFallbackTitle(locale) };
  }

  return {
    title: await formatTripPageTitle(
      data.trip.title,
      data.profile.displayName,
      locale,
    ),
    description: data.trip.description,
    openGraph: {
      title: data.trip.title,
      description: data.trip.description,
      images: [{ url: data.trip.coverImageUrl }],
    },
  };
}
