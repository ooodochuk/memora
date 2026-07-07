import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Profile } from "@/types";
import { routes } from "@/constants/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { JournalCard } from "@/components/design-system/journal-card";
import { ArrowRight } from "lucide-react";

interface PublicTripAuthorFooterProps {
 profile: Profile;
}

function profileInitials(displayName: string): string {
 return displayName
 .split(" ")
 .map((part) => part[0])
 .join("")
 .slice(0, 2)
 .toUpperCase();
}

export async function PublicTripAuthorFooter({
 profile,
}: PublicTripAuthorFooterProps) {
 const t = await getTranslations("publicTrip.author");

 return (
 <JournalCard padding="lg" className="overflow-hidden">
 <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
 <div className="flex items-start gap-4">
 <Avatar className="size-16 border-2 border-background shadow-sm sm:size-20">
 <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
 <AvatarFallback className="font-heading text-lg">
 {profileInitials(profile.displayName)}
 </AvatarFallback>
 </Avatar>

 <div className="space-y-2">
 <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
 {t("eyebrow")}
 </p>
 <h2 className="font-heading text-2xl font-medium tracking-tight">
 {profile.displayName}
 </h2>
 <p className="text-sm text-muted-foreground">@{profile.username}</p>
 <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
 {profile.bio}
 </p>
 </div>
 </div>

 <Button
 variant="warm"
 size="lg"
 className="shrink-0 gap-2"
 render={<Link href={routes.profile(profile.username)} />}
 >
 {t("cta")}
 <ArrowRight className="size-4" />
 </Button>
 </div>
 </JournalCard>
 );
}
