"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { routes, dashboardRoutes } from "@/constants/routes";
import { useCurrentProfile } from "@/features/auth/hooks";
import { useAuth } from "@/providers/auth-provider";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Button } from "@/components/ui/button";
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
  const { data: profile } = useCurrentProfile();
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

  const authActions = isAuthenticated ? (
    <Button
      variant="outline"
      size="sm"
      className="hidden sm:inline-flex"
      render={<Link href={dashboardRoutes.home()} />}
    >
      {t("dashboard")}
    </Button>
  ) : (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="hidden sm:inline-flex"
        render={<Link href="/login" />}
      >
        {t("signIn")}
      </Button>
      <Button
        variant="warm"
        size="sm"
        className="hidden sm:inline-flex"
        render={<Link href="/register" />}
      >
        {t("signUp")}
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
          {isReady ? authActions : null}
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
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    className="justify-start"
                    render={
                      <Link
                        href={dashboardRoutes.home()}
                        onClick={() => setOpen(false)}
                      />
                    }
                  >
                    {t("dashboard")}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      render={
                        <Link href="/login" onClick={() => setOpen(false)} />
                      }
                    >
                      {t("signIn")}
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      render={
                        <Link href="/register" onClick={() => setOpen(false)} />
                      }
                    >
                      {t("signUp")}
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
