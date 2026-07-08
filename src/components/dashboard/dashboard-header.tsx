"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LogOut, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardRoutes, routes } from "@/constants/routes";
import { useCurrentProfile } from "@/features/auth/hooks";
import { useSignOut } from "@/features/auth/use-sign-out";
import { getProfileInitials } from "@/lib/profile/display";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Button } from "@/components/ui/button";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dashboardNavItems } from "@/lib/dashboard/nav-config";
import { pagePadding } from "@/lib/design-system/tokens";

export function DashboardHeader() {
 const t = useTranslations("dashboard.header");
 const tNav = useTranslations("dashboard.nav");
 const tCommon = useTranslations("common");
 const profileQuery = useCurrentProfile();
 const profile = profileQuery.data;
 const { signOut, isPending: isSigningOut } = useSignOut();
 const [menuOpen, setMenuOpen] = useState(false);

 const initials = profile ? getProfileInitials(profile.displayName) : "?";

 async function handleLogout() {
  if (isSigningOut) return;
  setMenuOpen(false);
  await signOut(t("logoutSuccess"));
 }

 return (
 <header className={cn("sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 backdrop-blur-sm sm:h-16", pagePadding)}>
 <div className="flex min-w-0 flex-1 items-center gap-3 lg:hidden">
 <Link
 href={dashboardRoutes.home()}
 className="font-heading text-lg font-medium"
 >
 {tCommon("appName")}
 </Link>
 </div>

 <div className="hidden flex-1 lg:block" />

 <div className="flex items-center gap-1.5 sm:gap-2">
 <Button
 variant="warm"
 size="sm"
 className="hidden gap-1.5 sm:inline-flex"
 render={<Link href={dashboardRoutes.newTrip()} />}
 >
 <Plus className="size-4" />
 {t("createTrip")}
 </Button>

 <Button
 variant="warm"
 size="icon-sm"
 className="sm:hidden"
 aria-label={t("createTrip")}
 render={<Link href={dashboardRoutes.newTrip()} />}
 >
 <Plus className="size-4" />
 </Button>

 <LocaleSwitcher />
 <ThemeToggle />

 <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
 <DropdownMenuTrigger
 aria-label={t("menuLabel")}
 render={
 <Button
 variant="ghost"
 size="icon-sm"
 className="rounded-full p-0"
 />
 }
 >
 <Avatar className="size-8">
 <AvatarImage
 src={profile?.avatarUrl ?? undefined}
 alt={profile?.displayName ?? t("menuLabel")}
 />
 <AvatarFallback className="text-xs">{initials}</AvatarFallback>
 </Avatar>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end" className="w-52">
 <div className="flex items-center gap-3 px-2 py-2">
 <Avatar className="size-10">
 <AvatarImage src={profile?.avatarUrl ?? undefined} alt="" />
 <AvatarFallback>{initials}</AvatarFallback>
 </Avatar>
 <div className="min-w-0">
 <p className="truncate text-sm font-medium">
 {profile?.displayName ?? "…"}
 </p>
 <p className="truncate text-xs text-muted-foreground">
 {profile ? `@${profile.username}` : "…"}
 </p>
 </div>
 </div>
 <DropdownMenuSeparator />
 {dashboardNavItems
 .filter((item) => !item.mobile)
 .map(({ key, href }) => (
 <DropdownMenuItem key={key} render={<Link href={href} />}>
 {tNav(key)}
 </DropdownMenuItem>
 ))}
 {profile ? (
 <DropdownMenuItem
 render={
 <Link href={routes.profile(profile.username)} />
 }
 >
 {t("viewJournal")}
 </DropdownMenuItem>
 ) : null}
 <DropdownMenuSeparator />
 <DropdownMenuItem
 variant="destructive"
 disabled={isSigningOut}
 aria-label={t("logOut")}
 className="text-muted-foreground focus:text-destructive data-highlighted:text-destructive"
 onClick={() => void handleLogout()}
 >
 <LogOut className="size-4" aria-hidden />
 {t("logOut")}
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 </div>
 </header>
 );
}
