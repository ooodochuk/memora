import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Profile } from "@/types";
import { PageContainer } from "@/components/design-system/page-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface PublicProfileHeroProps {
  profile: Profile;
  locale: string;
}

function profileInitials(displayName: string): string {
  return displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function toImageSrc(url: string | null | undefined): string | undefined {
  const trimmed = url?.trim();
  return trimmed || undefined;
}

export async function PublicProfileHero({
  profile,
}: PublicProfileHeroProps) {
  const t = await getTranslations("publicProfile");
  const coverSrc = toImageSrc(profile.coverUrl);
  const avatarSrc = toImageSrc(profile.avatarUrl);
  const summary = profile.bio?.trim() || profile.tagline?.trim();
  const location = profile.location?.trim();
  const website = profile.website?.trim();

  return (
    <section className="border-b border-border">
      {coverSrc ? (
        <div className="relative h-28 overflow-hidden sm:h-32">
          <Image
            src={coverSrc}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      ) : null}

      <PageContainer narrow className="py-4 sm:py-5">
        <div
          className={cn(
            "flex items-start gap-4",
            coverSrc && "-mt-10 sm:-mt-11",
          )}
        >
          <Avatar
            className={cn(
              "size-20 shrink-0 border-[3px] border-background shadow-sm sm:size-[5.5rem]",
              coverSrc && "ring-1 ring-border/60",
            )}
          >
            {avatarSrc ? (
              <AvatarImage src={avatarSrc} alt={profile.displayName} />
            ) : null}
            <AvatarFallback className="font-heading text-lg">
              {profileInitials(profile.displayName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
            <div className="space-y-0.5">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary/90">
                {t("eyebrow")}
              </p>
              <h1 className="font-heading text-2xl font-medium tracking-tight sm:text-[1.75rem]">
                {profile.displayName}
              </h1>
              <p className="text-sm text-muted-foreground">
                @{profile.username}
              </p>
            </div>

            {summary ? (
              <p className="text-sm leading-relaxed text-foreground">
                {summary}
              </p>
            ) : null}

            {(location || website || profile.isOwnProfile) && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                {location ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5 text-primary/80" aria-hidden />
                    {location}
                  </span>
                ) : null}
                {location && website ? <span aria-hidden>·</span> : null}
                {website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate font-medium text-primary transition-opacity hover:opacity-80"
                  >
                    {website.replace(/^https?:\/\//, "")}
                  </a>
                ) : null}
                {profile.isOwnProfile ? (
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                    {t("portfolioBadge")}
                  </Badge>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
