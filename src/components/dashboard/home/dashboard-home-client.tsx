"use client";

import { PageContainer } from "@/components/design-system/page-container";
import { QueryError } from "@/components/data-state/query-state";
import { DashboardHomeSkeleton } from "@/components/data-state/dashboard-home-skeleton";
import { DashboardWelcome } from "@/components/dashboard/home/dashboard-welcome";
import { DashboardJourneyStats } from "@/components/dashboard/home/dashboard-journey-stats";
import { DashboardTripsByStatus } from "@/components/dashboard/home/dashboard-trips-by-status";
import { useCurrentProfile } from "@/features/auth/hooks";
import {
  useAdventureSummaries,
  useDashboardHome,
} from "@/features/adventures/hooks";
import type { Profile } from "@/types";
import { profileDtoToProfile } from "@/lib/profile/dto-mappers";
import type { Trip } from "@/types";

export function DashboardHomeClient() {
  const profileQuery = useCurrentProfile();
  const summariesQuery = useAdventureSummaries();
  const homeQuery = useDashboardHome();

  const isLoading =
    profileQuery.isLoading || summariesQuery.isLoading || homeQuery.isLoading;

  if (isLoading) {
    return <DashboardHomeSkeleton />;
  }

  const failedQuery = profileQuery.isError
    ? profileQuery
    : summariesQuery.isError
      ? summariesQuery
      : homeQuery.isError
        ? homeQuery
        : null;

  if (failedQuery) {
    return (
      <PageContainer spacing="md">
        <QueryError
          error={failedQuery.error}
          onRetry={() => failedQuery.refetch()}
        />
      </PageContainer>
    );
  }

  const profile = profileDtoToProfile(profileQuery.data!);
  const stats = homeQuery.data!.stats;
  const tripItems =
    summariesQuery.data?.map((summary) => ({
      trip: summary.adventure as Trip,
      cloudLinkCount: summary.cloudLinkCount,
    })) ?? [];

  return (
    <PageContainer spacing="md" className="space-y-12 sm:space-y-14">
      <DashboardWelcome profile={profile} />
      <DashboardJourneyStats stats={stats} />
      <DashboardTripsByStatus items={tripItems} />
    </PageContainer>
  );
}
