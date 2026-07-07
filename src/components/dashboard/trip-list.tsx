"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Map } from "lucide-react";
import type { Trip } from "@/types";
import {
 matchesTripLifecycleFilter,
 matchesTripSearch,
 type TripLifecycleFilter,
} from "@/lib/trip-lifecycle";
import { TripCard } from "@/components/dashboard/trip-card";
import { EmptyState } from "@/components/design-system/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TripListItem {
 trip: Trip;
 cloudLinkCount: number;
}

interface TripListProps {
 items: TripListItem[];
}

const FILTERS: TripLifecycleFilter[] = [
 "all",
 "planning",
 "in_progress",
 "completed",
];

export function TripList({ items }: TripListProps) {
 const t = useTranslations("dashboard.pages.trips");
 const [activeFilter, setActiveFilter] = useState<TripLifecycleFilter>("all");
 const [searchQuery, setSearchQuery] = useState("");

 const filteredItems = useMemo(() => {
 return items
 .filter(({ trip }) => matchesTripLifecycleFilter(trip, activeFilter))
 .filter(({ trip }) => matchesTripSearch(trip, searchQuery))
 .sort(
 (a, b) =>
 new Date(b.trip.startDate).getTime() -
 new Date(a.trip.startDate).getTime(),
 );
 }, [items, activeFilter, searchQuery]);

 const filterLabels: Record<TripLifecycleFilter, string> = {
 all: t("filters.all"),
 planning: t("filters.planning"),
 in_progress: t("filters.inProgress"),
 completed: t("filters.completed"),
 };

 const hasActiveFilters = activeFilter !== "all" || searchQuery.trim().length > 0;

 return (
 <div className="space-y-6">
 <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
 <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
 {FILTERS.map((filter) => (
 <Button
 key={filter}
 type="button"
 variant={activeFilter === filter ? "warm" : "outline"}
 size="sm"
 className={cn(
 "shrink-0 rounded-full px-4",
 activeFilter !== filter && "border-border bg-card",
 )}
 onClick={() => setActiveFilter(filter)}
 >
 {filterLabels[filter]}
 </Button>
 ))}
 </div>

 <div className="relative w-full lg:max-w-xs">
 <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
 <Input
 type="search"
 value={searchQuery}
 onChange={(event) => setSearchQuery(event.target.value)}
 placeholder={t("searchPlaceholder")}
 className="rounded-full border-border bg-card pl-9 "
 aria-label={t("searchPlaceholder")}
 />
 </div>
 </div>

 {filteredItems.length > 0 ? (
 <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
 {filteredItems.map(({ trip, cloudLinkCount }) => (
 <TripCard
 key={trip.id}
 trip={trip}
 cloudLinkCount={cloudLinkCount}
 />
 ))}
 </div>
 ) : (
 <EmptyState
 icon={Map}
 title={
 searchQuery.trim()
 ? t("noResults")
 : hasActiveFilters
 ? t("noResultsFilter")
 : t("emptyTitle")
 }
 description={
 searchQuery.trim() || hasActiveFilters
 ? t("noResultsDescription")
 : t("emptyDescription")
 }
 size="md"
 />
 )}
 </div>
 );
}
