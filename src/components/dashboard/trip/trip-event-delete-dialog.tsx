"use client";

import { useTranslations } from "next-intl";
import type { TripEventWithRelations } from "@/types";
import { Button } from "@/components/ui/button";
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogFooter,
 DialogHeader,
 DialogTitle,
} from "@/components/ui/dialog";

interface TripEventDeleteDialogProps {
 event: TripEventWithRelations | null;
 open: boolean;
 onOpenChange: (open: boolean) => void;
 onConfirm: () => void;
}

export function TripEventDeleteDialog({
 event,
 open,
 onOpenChange,
 onConfirm,
}: TripEventDeleteDialogProps) {
 const t = useTranslations("dashboard.tripEventModal");
 const tCommon = useTranslations("common");

 if (!event) return null;

 return (
 <Dialog open={open} onOpenChange={onOpenChange}>
 <DialogContent className="sm:max-w-md" closeLabel={tCommon("close")}>
 <DialogHeader>
 <DialogTitle>{t("delete.title")}</DialogTitle>
 <DialogDescription>
 {t("delete.description", { title: event.title })}
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
