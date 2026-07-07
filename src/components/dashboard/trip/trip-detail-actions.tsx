"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Pencil } from "lucide-react";
import { dashboardRoutes } from "@/constants/routes";
import { Button } from "@/components/ui/button";

interface TripDetailActionsProps {
 tripId: string;
}

export function TripDetailActions({ tripId }: TripDetailActionsProps) {
 const tEdit = useTranslations("dashboard.pages.editTrip");

 return (
 <div className="flex flex-wrap gap-3">
 <Button
 variant="warm"
 render={<Link href={dashboardRoutes.editTrip(tripId)} />}
 >
 <Pencil className="size-4" />
 {tEdit("title")}
 </Button>
 </div>
 );
}
