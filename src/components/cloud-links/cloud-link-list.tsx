"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { CloudLink } from "@/types";
import {
 cloudLinkToFormValues,
 createTempCloudLinkId,
 formValuesToCloudLink,
 type CloudLinkFormValues,
} from "@/lib/validations/cloud-link-form";
import { CloudLinkCard } from "@/components/cloud-links/cloud-link-card";
import { CloudLinkForm } from "@/components/cloud-links/cloud-link-form";
import { EmptyState } from "@/components/design-system/empty-state";
import { Button } from "@/components/ui/button";
import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogHeader,
 DialogTitle,
} from "@/components/ui/dialog";
import { Cloud, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CloudLinkListProps {
 links: CloudLink[];
 editable?: boolean;
 tripId: string;
 eventId?: string;
 className?: string;
 onChange?: (links: CloudLink[]) => void;
}

export function CloudLinkList({
 links: initialLinks,
 editable = false,
 tripId,
 eventId,
 className,
 onChange,
}: CloudLinkListProps) {
 const t = useTranslations("cloudLink");
 const tCommon = useTranslations("common");
 const [links, setLinks] = useState(initialLinks);
 const [dialogOpen, setDialogOpen] = useState(false);
 const [editingLink, setEditingLink] = useState<CloudLink | null>(null);

 useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect -- sync editable list from parent props
  setLinks(initialLinks);
 }, [initialLinks]);

 const displayLinks = editable ? links : initialLinks;

 function updateLinks(next: CloudLink[]) {
 setLinks(next);
 onChange?.(next);
 }

 function openCreateDialog() {
 setEditingLink(null);
 setDialogOpen(true);
 }

 function openEditDialog(link: CloudLink) {
 setEditingLink(link);
 setDialogOpen(true);
 }

 function handleDelete(linkId: string) {
 updateLinks(links.filter((link) => link.id !== linkId));
 }

 function handleFormSubmit(values: CloudLinkFormValues) {
 if (editingLink) {
 updateLinks(
 links.map((link) =>
 link.id === editingLink.id
 ? formValuesToCloudLink(values, {
 id: link.id,
 tripId,
 eventId,
 })
 : link,
 ),
 );
 } else {
 updateLinks([
 ...links,
 formValuesToCloudLink(values, {
 id: createTempCloudLinkId(),
 tripId,
 eventId,
 }),
 ]);
 }

 setDialogOpen(false);
 setEditingLink(null);
 }

 const isEditable = editable;

 return (
 <div className={cn("space-y-3", className)}>
 <div className="flex items-start justify-between gap-3">
 <div className="space-y-1">
 <p className="flex items-center gap-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
 <Cloud className="size-3.5 text-primary/90" aria-hidden />
 {displayLinks.length > 1
 ? t("sectionTitlePlural")
 : t("sectionTitle")}
 </p>
 {editable && (
 <p className="text-xs leading-relaxed text-muted-foreground">
 {t("sectionDescription")}
 </p>
 )}
 </div>

 {isEditable && (
 <Button
 type="button"
 variant="outline"
 size="sm"
 className="shrink-0 gap-1.5"
 onClick={openCreateDialog}
 >
 <Plus className="size-3.5" />
 {t("addLink")}
 </Button>
 )}
 </div>

 {displayLinks.length === 0 ? (
 editable ? (
 <EmptyState
 icon={Cloud}
 title={t("emptyTitle")}
 description={t("emptyDescription")}
 size="sm"
 action={
 <Button
 type="button"
 variant="outline"
 size="sm"
 className="gap-1.5"
 onClick={openCreateDialog}
 >
 <Plus className="size-3.5" />
 {t("addLink")}
 </Button>
 }
 />
 ) : null
 ) : (
 <div className="space-y-3">
 {displayLinks.map((link) => (
 <CloudLinkCard
 key={link.id}
 link={link}
 showActions={isEditable}
 onEdit={() => openEditDialog(link)}
 onDelete={() => handleDelete(link.id)}
 />
 ))}
 </div>
 )}

 {isEditable && (
 <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
 <DialogContent className="sm:max-w-lg" closeLabel={tCommon("close")}>
 <DialogHeader>
 <DialogTitle>
 {editingLink ? t("editDialogTitle") : t("addDialogTitle")}
 </DialogTitle>
 <DialogDescription>
 {t("addDialogDescription")}
 </DialogDescription>
 </DialogHeader>
 <CloudLinkForm
 key={editingLink?.id ?? "new"}
 defaultValues={
 editingLink ? cloudLinkToFormValues(editingLink) : undefined
 }
 submitLabel={
 editingLink ? t("form.save") : t("form.add")
 }
 onCancel={() => {
 setDialogOpen(false);
 setEditingLink(null);
 }}
 onSubmit={handleFormSubmit}
 />
 </DialogContent>
 </Dialog>
 )}
 </div>
 );
}
