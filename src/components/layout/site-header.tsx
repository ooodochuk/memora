"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { routes, dashboardRoutes } from "@/constants/routes";
import { useCurrentProfile, useLogout } from "@/features/auth/hooks";
import { useAuth } from "@/providers/auth-provider";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Button } from "@/components/ui/button";
import { useAppToast } from "@/components/design-system/app-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfileInitials } from "@/lib/profile/display";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const { isReady, isAuthenticated } = useAuth();
  const profileQuery = useCurrentProfile();
  const profile = profileQuery.data;
  const router = useRouter();
  const logout = useLogout();
  const { showToast } = useAppToast();
  const [open, setOpen] = useState(false);

  const journalHref = !isAuthenticated
    ? "/login"
    : profile?.username
      ? routes.profile(profile.username)
      : dashboardRoutes.home();

  const navLinks = [
    { href: "/", label: t("home") },
    { href: journalHref, label: t("journal") },
    { href: "/#explore", label: t("explore") },
  ];

  const initials = profile
    ? getProfileInitials(profile.displayName)
    : "?";

  async function handleLogout() {
    await logout.mutateAsync();
    showToast(t("logoutSuccess"));
    router.replace("/");
  }

  const authArea = !isReady ? (
    <Skeleton className="size-8 rounded-full" aria-hidden />
  ) : isAuthenticated ? (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("menu")}
        render={
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-full px-2 py-0"
          />
        }
      >
        <div className="flex items-center gap-2">
          <Avatar className="size-7">
            {profile?.avatarUrl ? (
              <AvatarImage
                src={profile.avatarUrl}
                alt={profile.displayName}
              />
            ) : null}
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden min-w-0 sm:block">
            <p className="max-w-[10rem] truncate text-sm font-medium">
              {profile?.displayName ?? profile?.username ?? tCommon("loading")}
            </p>
            <p className="max-w-[10rem] truncate text-xs text-muted-foreground">
              {profile?.username ? `@${profile.username}` : ""}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="size-10">
            {profile?.avatarUrl ? (
              <AvatarImage src={profile.avatarUrl} alt="" />
            ) : null}
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {profile?.displayName ?? profile?.username ?? tCommon("loading")}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {profile?.username ? `@${profile.username}` : ""}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          render={
            <Link
              href={
                profile?.username
                  ? routes.profile(profile.username)
                  : dashboardRoutes.profile()
              }
            />
          }
        >
          {t("myProfile")}
        </DropdownMenuItem>

        <DropdownMenuItem render={<Link href={dashboardRoutes.home()} />}>
          {t("dashboard")}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          disabled={logout.isPending}
          onClick={async () => {
            if (logout.isPending) return;
            await handleLogout();
          }}
        >
          {t("logOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="hidden sm:inline-flex"
        render={<Link href="/login" />}
      >
        {t("logIn")}
      </Button>
      <Button
        variant="warm"
        size="sm"
        className="hidden sm:inline-flex"
        render={<Link href="/register" />}
      >
        {t("startAdventure")}
      </Button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <Container className="flex h-14 items-center justify-between sm:h-16">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="font-heading text-xl font-medium tracking-tight">
            {tCommon("appName")}
          </span>
          <span className="hidden text-xs tracking-wide text-muted-foreground sm:inline">
            {tCommon("tagline")}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Button
              key={`${link.label}-${link.href}`}
              variant="ghost"
              size="sm"
              render={<Link href={link.href} />}
            >
              {link.label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {authArea}
          <LocaleSwitcher />
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="md:hidden"
              render={
                <Button variant="ghost" size="icon" aria-label={t("openMenu")} />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72" closeLabel={t("closeMenu")}>
              <SheetHeader>
                <SheetTitle>{t("menu")}</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Button
                    key={`${link.label}-${link.href}-mobile`}
                    variant="ghost"
                    className="justify-start"
                    render={
                      <Link href={link.href} onClick={() => setOpen(false)} />
                    }
                  >
                    {link.label}
                  </Button>
                ))}
                {!isAuthenticated ? (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      render={
                        <Link
                          href="/login"
                          onClick={() => setOpen(false)}
                        />
                      }
                    >
                      {t("logIn")}
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      render={
                        <Link
                          href="/register"
                          onClick={() => setOpen(false)}
                        />
                      }
                    >
                      {t("startAdventure")}
                    </Button>
                  </>
                ) : null}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
