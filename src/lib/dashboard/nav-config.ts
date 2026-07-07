import {
  Backpack,
  Compass,
  Heart,
  Map,
  MapPin,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";
import { dashboardRoutes } from "@/constants/routes";

export type DashboardNavKey =
  | "trips"
  | "equipment"
  | "places"
  | "wishlist"
  | "profile"
  | "settings";

export interface DashboardNavItem {
  key: DashboardNavKey;
  href: string;
  icon: LucideIcon;
  /** Show in mobile bottom bar (max 5 primary items) */
  mobile?: boolean;
}

export const dashboardNavItems: DashboardNavItem[] = [
  {
    key: "trips",
    href: dashboardRoutes.home(),
    icon: Map,
    mobile: true,
  },
  {
    key: "equipment",
    href: dashboardRoutes.equipment(),
    icon: Backpack,
    mobile: true,
  },
  {
    key: "places",
    href: dashboardRoutes.places(),
    icon: MapPin,
    mobile: true,
  },
  {
    key: "wishlist",
    href: dashboardRoutes.wishlist(),
    icon: Heart,
    mobile: false,
  },
  {
    key: "profile",
    href: dashboardRoutes.profile(),
    icon: User,
    mobile: true,
  },
  {
    key: "settings",
    href: dashboardRoutes.settings(),
    icon: Settings,
    mobile: false,
  },
];

export const dashboardBrandIcon = Compass;

/** Home hub: dashboard root and all adventure detail/form routes. */
export function isDashboardHomeActive(pathname: string): boolean {
  return (
    pathname === dashboardRoutes.home() ||
    pathname.startsWith("/dashboard/trips/")
  );
}

export function isDashboardNavActive(pathname: string, href: string): boolean {
  if (href === dashboardRoutes.home()) {
    return isDashboardHomeActive(pathname);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
