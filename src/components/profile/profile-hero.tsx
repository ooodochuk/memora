import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { Profile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProfileStatsBar } from "@/components/profile/profile-stats";

interface ProfileHeroProps {
 profile: Profile;
 locale: string;
}

export async function ProfileHero({ profile, locale }: ProfileHeroProps) {
 const t = await getTranslations("profile");
 const memberSince = new Intl.DateTimeFormat(
 locale === "uk" ? "uk-UA" : "en-US",
 { month: "long", year: "numeric" },
 ).format(new Date(profile.createdAt));

 const initials = profile.displayName
 .split(" ")
 .map((n) => n[0])
 .join("")
 .slice(0, 2);

 return (
 <section className="relative">
 <div className="relative h-48 overflow-hidden sm:h-64 md:h-80">
 <Image
 src={profile.coverUrl}
 alt=""
 fill
 priority
 className="object-cover"
 sizes="100vw"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
 </div>

 <div className="-mt-16 relative z-10 px-4 sm:-mt-20 sm:px-6 lg:px-8">
 <div className="mx-auto max-w-6xl">
 <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
 <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
 <Avatar className="size-24 border-4 border-background shadow-lg sm:size-28">
 <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
 <AvatarFallback className="font-heading text-xl">
 {initials}
 </AvatarFallback>
 </Avatar>
 <div className="space-y-2 pb-1">
 <div className="flex flex-wrap items-center gap-2">
 <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
 {profile.displayName}
 </h1>
 {profile.isOwnProfile && (
 <Badge variant="secondary">{t("editProfile")}</Badge>
 )}
 </div>
 <p className="text-muted-foreground">@{profile.username}</p>
 <p className="max-w-xl text-sm leading-relaxed sm:text-base">
 {profile.bio}
 </p>
 <p className="text-sm text-muted-foreground">
 {profile.location} · {t("memberSince", { date: memberSince })}
 </p>
 </div>
 </div>
 </div>

 <ProfileStatsBar stats={profile.stats} className="mt-8" />
 </div>
 </div>
 </section>
 );
}
