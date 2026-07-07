"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  dashboardBrandIcon,
  dashboardNavItems,
  isDashboardNavActive,
} from "@/lib/dashboard/nav-config";
import { useCurrentProfile } from "@/features/auth/hooks";

const BrandIcon = dashboardBrandIcon;

function isNavActive(pathname: string, href: string): boolean {
  return isDashboardNavActive(pathname, href);
}

export function DashboardSidebar() {
 const t = useTranslations("dashboard.nav");
 const tHeader = useTranslations("dashboard.header");
 const tCommon = useTranslations("common");
 const pathname = usePathname();
 const profileQuery = useCurrentProfile();
 const profile = profileQuery.data;

 return (
 <aside
 className="bg-card hidden w-64 shrink-0 border-r border-border lg:flex lg:flex-col"
 aria-label={tHeader("sidebarLabel")}
 >
 <div className="flex h-16 items-center gap-2.5 px-6">
 <div className="flex size-9 items-center justify-center rounded-xl bg-brand/12 text-brand">
 <BrandIcon className="size-4.5" strokeWidth={1.75} />
 </div>
 <div className="min-w-0">
 <p className="font-heading text-lg font-medium leading-tight tracking-tight">
 {tCommon("appName")}
 </p>
 <p className="truncate text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase">
 {t("trips")}
 </p>
 </div>
 </div>

 <nav className="flex-1 space-y-0.5 px-3 py-4">
 {dashboardNavItems.map(({ key, href, icon: Icon }) => {
 const active = isNavActive(pathname, href);
 return (
 <Link
 key={key}
 href={href}
 className={cn(
 "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
 active
 ? "bg-accent/80 text-foreground"
 : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
 )}
 >
 <Icon className="size-4.5 shrink-0" strokeWidth={1.75} />
 {t(key)}
 </Link>
 );
 })}
 </nav>

 <div className="border-t border-border p-4">
 <p className="truncate text-sm font-medium">
 {profile?.displayName ?? "…"}
 </p>
 <p className="truncate text-xs text-muted-foreground">
 {profile ? `@${profile.username}` : "…"}
 </p>
 </div>
 </aside>
 );
}
