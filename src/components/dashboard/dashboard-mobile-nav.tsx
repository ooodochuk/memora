"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { dashboardNavItems, isDashboardNavActive } from "@/lib/dashboard/nav-config";

function isNavActive(pathname: string, href: string): boolean {
  return isDashboardNavActive(pathname, href);
}

export function DashboardMobileNav() {
 const t = useTranslations("dashboard.nav");
 const tHeader = useTranslations("dashboard.header");
 const pathname = usePathname();

 return (
 <nav
 className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card lg:hidden"
 aria-label={tHeader("sidebarLabel")}
 >
 <div className="mx-auto grid max-w-lg grid-cols-4 gap-0.5 px-1 pb-[max(0.375rem,env(safe-area-inset-bottom))] pt-1.5">
 {dashboardNavItems
 .filter((item) => item.mobile)
 .map(({ key, href, icon: Icon }) => {
 const active = isNavActive(pathname, href);
 return (
 <Link
 key={key}
 href={href}
 className={cn(
 "flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[0.5625rem] font-medium leading-none transition-colors sm:px-1.5 sm:text-[0.625rem]",
 active
 ? "bg-accent/80 text-foreground"
 : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
 )}
 >
 <Icon className="size-[1.125rem] sm:size-5" strokeWidth={active ? 2 : 1.75} />
 <span className="max-w-full truncate text-center">{t(key)}</span>
 </Link>
 );
 })}
 </div>
 </nav>
 );
}
