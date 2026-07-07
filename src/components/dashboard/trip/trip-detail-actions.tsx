"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Archive, Pencil, Trash2 } from "lucide-react";
import { dashboardRoutes } from "@/constants/routes";
import {
  useAdventure,
  useArchiveAdventure,
  useDeleteAdventure,
} from "@/features/adventures/hooks";
import { adventureDtoToTrip } from "@/lib/api-mappers";
import { isArchivedTripStatus } from "@/lib/reference/adventure-status";
import { useAppToast } from "@/components/design-system/app-toast";
import { TripArchiveDialog } from "@/components/dashboard/trip/trip-archive-dialog";
import { TripDeleteDialog } from "@/components/dashboard/trip/trip-delete-dialog";
import { Button } from "@/components/ui/button";

interface TripDetailActionsProps {
  tripId: string;
}

export function TripDetailActions({ tripId }: TripDetailActionsProps) {
  const tEdit = useTranslations("dashboard.pages.editTrip");
  const tActions = useTranslations("dashboard.tripActions");
  const router = useRouter();
  const { showToast } = useAppToast();
  const adventureQuery = useAdventure(tripId);
  const deleteMutation = useDeleteAdventure();
  const archiveMutation = useArchiveAdventure();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);

  const trip = adventureQuery.data
    ? adventureDtoToTrip(adventureQuery.data)
    : null;

  if (!trip) return null;

  const isArchived = isArchivedTripStatus(trip.status);

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(tripId);
      showToast(tActions("delete.success"));
      setDeleteOpen(false);
      router.push(dashboardRoutes.trips());
    } catch {
      showToast(tActions("delete.error"), "error");
    }
  }

  async function handleArchive() {
    try {
      await archiveMutation.mutateAsync(tripId);
      showToast(tActions("archive.success"));
      setArchiveOpen(false);
      router.push(dashboardRoutes.trips());
    } catch {
      showToast(tActions("archive.error"), "error");
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="warm"
          render={<Link href={dashboardRoutes.editTrip(tripId)} />}
        >
          <Pencil className="size-4" />
          {tEdit("title")}
        </Button>

        {!isArchived && (
          <Button variant="outline" onClick={() => setArchiveOpen(true)}>
            <Archive className="size-4" />
            {tActions("archive.action")}
          </Button>
        )}

        <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="size-4" />
          {tActions("delete.action")}
        </Button>
      </div>

      <TripDeleteDialog
        title={trip.title}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />

      <TripArchiveDialog
        title={trip.title}
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        onConfirm={handleArchive}
        isPending={archiveMutation.isPending}
      />
    </>
  );
}
