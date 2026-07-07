"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Photo } from "@/types";
import { FormField } from "@/components/design-system/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

function isValidHttpUrl(value: string): boolean {
 try {
 const url = new URL(value);
 return url.protocol === "http:" || url.protocol === "https:";
 } catch {
 return false;
 }
}

export function createMomentPhoto(
 url: string,
 tripId: string,
 eventId: string,
 alt = "",
): Photo {
 return {
 id: `photo-${eventId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
 tripId,
 url,
 alt,
 eventId,
 };
}

interface MomentPhotoPickerProps {
 photos: Photo[];
 onChange: (photos: Photo[]) => void;
 tripId: string;
 eventId: string;
 className?: string;
}

export function MomentPhotoPicker({
 photos,
 onChange,
 tripId,
 eventId,
 className,
}: MomentPhotoPickerProps) {
 const t = useTranslations("dashboard.tripEventModal");
 const fileInputRef = useRef<HTMLInputElement>(null);
 const [urlInput, setUrlInput] = useState("");
 const [urlError, setUrlError] = useState<string | null>(null);
 const [brokenIds, setBrokenIds] = useState<Set<string>>(new Set());

 function addFromUrl() {
 const trimmed = urlInput.trim();
 if (!trimmed) return;

 if (!isValidHttpUrl(trimmed)) {
 setUrlError(t("fields.photos.urlInvalid"));
 return;
 }

 setUrlError(null);
 onChange([...photos, createMomentPhoto(trimmed, tripId, eventId)]);
 setUrlInput("");
 }

 function addFromFile(file: File) {
 if (!file.type.startsWith("image/")) return;
 const objectUrl = URL.createObjectURL(file);
 onChange([
 ...photos,
 createMomentPhoto(objectUrl, tripId, eventId, file.name.replace(/\.[^.]+$/, "")),
 ]);
 }

 function removePhoto(photoId: string) {
 const photo = photos.find((item) => item.id === photoId);
 if (photo?.url.startsWith("blob:")) {
 URL.revokeObjectURL(photo.url);
 }
 onChange(photos.filter((item) => item.id !== photoId));
 setBrokenIds((prev) => {
 const next = new Set(prev);
 next.delete(photoId);
 return next;
 });
 }

 return (
 <FormField
 label={t("fields.photos.label")}
 htmlFor="moment-photo-url"
 hint={t("fields.photos.hint")}
 className={className}
 >
 <div className="space-y-3">
 <div className="flex flex-col gap-2 sm:flex-row">
 <Input
 id="moment-photo-url"
 value={urlInput}
 onChange={(event) => {
 setUrlInput(event.target.value);
 if (urlError) setUrlError(null);
 }}
 placeholder={t("fields.photos.urlPlaceholder")}
 aria-invalid={!!urlError}
 onKeyDown={(event) => {
 if (event.key === "Enter") {
 event.preventDefault();
 addFromUrl();
 }
 }}
 />
 <div className="flex shrink-0 gap-2">
 <Button
 type="button"
 variant="outline"
 className="gap-1.5"
 onClick={addFromUrl}
 disabled={!urlInput.trim()}
 >
 <ImagePlus className="size-4" />
 {t("fields.photos.addUrl")}
 </Button>
 <Button
 type="button"
 variant="outline"
 className="gap-1.5"
 onClick={() => fileInputRef.current?.click()}
 >
 <Upload className="size-4" />
 {t("fields.photos.upload")}
 </Button>
 </div>
 </div>

 {urlError && (
 <p className="text-xs text-destructive" role="alert">
 {urlError}
 </p>
 )}

 <input
 ref={fileInputRef}
 type="file"
 accept="image/*"
 className="sr-only"
 onChange={(event) => {
 const file = event.target.files?.[0];
 if (file) addFromFile(file);
 event.target.value = "";
 }}
 />

 {photos.length > 0 ? (
 <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
 {photos.map((photo) => (
 <li
 key={photo.id}
 className="group/photo relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
 >
 {!brokenIds.has(photo.id) ? (
 <Image
 src={photo.url}
 alt={photo.alt || t("fields.photos.previewAlt")}
 fill
 className="object-cover"
 sizes="120px"
 unoptimized={photo.url.startsWith("blob:")}
 onError={() =>
 setBrokenIds((prev) => new Set(prev).add(photo.id))
 }
 />
 ) : (
 <div className="flex h-full items-center justify-center p-2 text-center text-[10px] text-muted-foreground">
 {t("fields.photos.previewError")}
 </div>
 )}
 <Button
 type="button"
 variant="ghost"
 size="icon-sm"
 className={cn(
 "absolute top-1 right-1 size-7 bg-background/80 text-muted-foreground",
 "opacity-100 sm:opacity-0 sm:group-hover/photo:opacity-100",
 "hover:bg-background hover:text-destructive",
 )}
 aria-label={t("fields.photos.remove")}
 onClick={() => removePhoto(photo.id)}
 >
 <Trash2 className="size-3.5" />
 </Button>
 </li>
 ))}
 </ul>
 ) : (
 <p className="rounded-xl border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
 {t("fields.photos.empty")}
 </p>
 )}
 </div>
 </FormField>
 );
}
