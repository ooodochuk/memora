"use client";

import { useTranslations } from "next-intl";
import type { TripDay } from "@/types";
import { Button } from "@/components/ui/button";
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader,
 DialogTitle,
} from "@/components/ui/dialog";

interface TripDayDeleteDialogProps {
 day: TripDay | null;
 open: boolean;
 onOpenChange: (open: boolean) => void;
 onConfirm: () => void;
}

export function TripDayDeleteDialog({
 day,
 open,
 onOpenChange,
 onConfirm,
}: TripDayDeleteDialogProps) {
 const t = useTranslations("dashboard.tripDayForm");
 const tTrip = useTranslations("trip");
 const tCommon = useTranslations("common");

 if (!day) return null;

 const label =
 day.title?.trim() ||
 tTrip("dayLabel", { number: day.dayNumber });

 return (
 <Dialog open={open} onOpenChange={onOpenChange}>
 <DialogContent className="sm:max-w-md" closeLabel={tCommon("close")}>
 <DialogHeader>
 <DialogTitle>{t("delete.title")}</DialogTitle>
 <DialogDescription>
 {t("delete.description", { label })}
 </DialogDescription>
 </DialogHeader>
 <DialogFooter className="gap-2 sm:gap-0">
 <Button variant="outline" onClick={() => onOpenChange(false)}>
 {t("actions.cancel")}
 </Button>
 <Button
 variant="destructive"
 onClick={() => {
 onConfirm();
 onOpenChange(false);
 }}
 >
 {t("delete.confirm")}
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 );
}
