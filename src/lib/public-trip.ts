import { isMockMode } from "@/api/config";
import { fetchPublicAdventure } from "@/features/public/api";
import {
  adventureDtoToTrip,
  dayDtoToTripDay,
  momentDtoToTripEvent,
} from "@/lib/api-mappers";
import { cloudLinkDtoToCloudLink } from "@/lib/media/cloud-link-mappers";
import {
  getCloudLinksByTripId,
  getDaysByTripId,
  getEventsWithRelationsByDayId,
  getPhotosByTripId,
  getProfileByUsername,
  getTripBySlug,
} from "@/lib/mock-data/accessors";
import { publicProfileDtoToProfile } from "@/lib/profile/public-mappers";
import { resolveEventRelations } from "@/lib/trip-timeline/utils";
import type { CloudLink, Photo, Profile, Trip, TripDay, TripEventWithRelations } from "@/types";

export interface PublicTripTimelineDay {
  day: TripDay;
  events: TripEventWithRelations[];
}

export interface PublicTripPageData {
  profile: Profile;
  trip: Trip;
  timelineDays: PublicTripTimelineDay[];
  photos: Photo[];
  cloudLinks: CloudLink[];
  mediaLinks: CloudLink[];
}

function getPublicTripPageDataMock(
  username: string,
  slug: string,
): PublicTripPageData | null {
  const profile = getProfileByUsername(username);
  const trip = getTripBySlug(slug);

  if (!profile || !trip || trip.ownerId !== profile.id) {
    return null;
  }

  if (trip.visibility !== "public" || trip.status !== "published") {
    return null;
  }

  const timelineDays = getDaysByTripId(trip.id).map((day) => ({
    day,
    events: getEventsWithRelationsByDayId(day.id),
  }));

  const photos = getPhotosByTripId(trip.id);
  const cloudLinks = getCloudLinksByTripId(trip.id);
  const mediaLinks = cloudLinks.filter(
    (link) =>
      link.contentType === "drone_footage" ||
      link.contentType === "video" ||
      link.contentType === "raw_photos",
  );

  return {
    profile,
    trip,
    timelineDays,
    photos,
    cloudLinks,
    mediaLinks,
  };
}

export async function getPublicTripPageData(
  username: string,
  slug: string,
): Promise<PublicTripPageData | null> {
  if (isMockMode()) {
    return getPublicTripPageDataMock(username, slug);
  }

  const detail = await fetchPublicAdventure(username, slug);
  if (!detail) return null;

  const profile = publicProfileDtoToProfile(detail.profile);
  const trip = adventureDtoToTrip(detail.adventure);
  const cloudLinks = detail.cloudLinks.map(cloudLinkDtoToCloudLink);
  const mediaLinks = cloudLinks.filter(
    (link) =>
      link.contentType === "drone_footage" ||
      link.contentType === "video" ||
      link.contentType === "raw_photos",
  );

  const timelineDays = detail.days.map((dayDto) => {
    const day = dayDtoToTripDay(dayDto);
    const events = detail.moments
      .filter((moment) => moment.dayId === day.id)
      .map((moment) => momentDtoToTripEvent(moment))
      .map((event) =>
        resolveEventRelations(event, [], cloudLinks, []),
      );

    return { day, events };
  });

  return {
    profile,
    trip,
    timelineDays,
    photos: [],
    cloudLinks,
    mediaLinks,
  };
}

export function getPublicTripStaticParams(): Array<{
  username: string;
  slug: string;
}> {
  return [
    { username: "oksana", slug: "switzerland-bikepacking" },
    { username: "oksana", slug: "portugal-active" },
    { username: "oksana", slug: "carpathians-hiking" },
  ];
}
