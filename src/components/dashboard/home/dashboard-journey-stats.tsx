"use client";

import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";
import {
 Bike,
 CalendarDays,
 Car,
 Footprints,
 Globe,
 MapPin,
 Map,
} from "lucide-react";
import type { DashboardStats } from "@/types";
import { DashboardStatCard } from "@/components/dashboard/home/dashboard-stat-card";
import { Eyebrow } from "@/components/design-system/typography";
import { cn } from "@/lib/utils";
import { STAT_DASHBOARD_ITEM_CLASS, STAT_ROW_CLASS } from "@/lib/stats-layout";

interface DashboardJourneyStatsProps {
 stats: DashboardStats;
}

export function DashboardJourneyStats({ stats }: DashboardJourneyStatsProps) {
 const t = useTranslations("dashboard.pages.home.stats");
 const tHome = useTranslations("dashboard.pages.home");

 const items: Array<{
 id: string;
 numericValue: number;
 value: string;
 label: string;
 description: string;
 icon: LucideIcon;
 suffix?: string;
 }> = [
 {
 id: "trips",
 numericValue: stats.totalTrips,
 value: String(stats.totalTrips),
 label: t("trips"),
 description: t("tripsDescription"),
 icon: Map,
 },
 {
 id: "days",
 numericValue: stats.totalDays,
 value: String(stats.totalDays),
 label: t("days"),
 description: t("daysDescription"),
 icon: CalendarDays,
 },
 {
 id: "countries",
 numericValue: stats.countries,
 value: String(stats.countries),
 label: t("countries"),
 description: t("countriesDescription"),
 icon: Globe,
 },
 {
 id: "places",
 numericValue: stats.places,
 value: String(stats.places),
 label: t("places"),
 description: t("placesDescription"),
 icon: MapPin,
 },
 {
 id: "hiking",
 numericValue: stats.hikingKm,
 value: String(stats.hikingKm),
 label: t("hiking"),
 description: t("hikingDescription"),
 icon: Footprints,
 suffix: t("kmUnit"),
 },
 {
 id: "cycling",
 numericValue: stats.cyclingKm,
 value: String(stats.cyclingKm),
 label: t("cycling"),
 description: t("cyclingDescription"),
 icon: Bike,
 suffix: t("kmUnit"),
 },
 {
 id: "driving",
 numericValue: stats.drivingKm,
 value: String(stats.drivingKm),
 label: t("driving"),
 description: t("drivingDescription"),
 icon: Car,
 suffix: t("kmUnit"),
 },
 ];

 const visibleItems = items.filter((item) => item.numericValue > 0);

 if (visibleItems.length === 0) return null;

 return (
 <section className="space-y-4">
 <Eyebrow>{tHome("statsEyebrow")}</Eyebrow>
 <ul className={cn(STAT_ROW_CLASS, "list-none p-0")}>
 {visibleItems.map(({ id, value, label, description, icon, suffix }) => (
 <li key={id} className={STAT_DASHBOARD_ITEM_CLASS}>
 <DashboardStatCard
 value={value}
 label={label}
 description={description}
 icon={icon}
 suffix={suffix}
 compact
 />
 </li>
 ))}
 </ul>
 </section>
 );
}
