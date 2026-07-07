"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormField } from "@/components/design-system/form-field";
import { Button } from "@/components/ui/button";
import { useUploadMedia } from "@/features/media/hooks";
import { isMemoraUploadedUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";

const ASPECT_CLASS = {
  "4/3": "aspect-[4/3]",
  "16/10": "aspect-[16/10]",
  square: "aspect-square",
} as const;

export type ImageUploadAspectRatio = keyof typeof ASPECT_CLASS;

export interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  helperText?: string;
  aspectRatio?: ImageUploadAspectRatio;
  disabled?: boolean;
  optional?: boolean;
  error?: string;
  id?: string;
  className?: string;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export function ImageUploadField({
  value,
  onChange,
  label,
  helperText,
  aspectRatio = "4/3",
  disabled = false,
  optional = false,
  error,
  id = "image-upload",
  className,
}: ImageUploadFieldProps) {
  const t = useTranslations("common.imageUpload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadMedia();
  const [previewError, setPreviewError] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isUploading = uploadMutation.isPending;
  const displayError = error ?? localError ?? (uploadMutation.error ? t("uploadFailed") : null);

  const processFile = useCallback(
    async (file: File) => {
      setLocalError(null);
      setPreviewError(false);

      if (!file.type.startsWith("image/") || !ACCEPTED_TYPES.includes(file.type)) {
        setLocalError(t("invalidType"));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setLocalError(t("tooLarge"));
        return;
      }

      try {
        const result = await uploadMutation.mutateAsync(file);
        onChange(result.url);
      } catch {
        setLocalError(t("uploadFailed"));
      }
    },
    [onChange, t, uploadMutation],
  );

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void processFile(file);
    event.target.value = "";
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);
    if (disabled || isUploading) return;

    const file = event.dataTransfer.files?.[0];
    if (file) void processFile(file);
  }

  function handleRemove() {
    onChange("");
    setPreviewError(false);
    setLocalError(null);
  }

  return (
    <FormField
      label={label}
      htmlFor={id}
      hint={helperText}
      optional={optional}
      error={displayError ?? undefined}
      className={className}
    >
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-xl border border-dashed border-border bg-muted/40 transition-colors",
            ASPECT_CLASS[aspectRatio],
            dragActive && "border-primary bg-primary/5",
            disabled && "pointer-events-none opacity-60",
          )}
          onDragEnter={(event) => {
            event.preventDefault();
            if (!disabled && !isUploading) setDragActive(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragActive(false);
          }}
          onDrop={handleDrop}
        >
          {value && !previewError ? (
            <>
              <Image
                src={value}
                alt={t("previewAlt")}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={isMemoraUploadedUrl(value)}
                onError={() => setPreviewError(true)}
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 bg-gradient-to-t from-background/95 via-background/70 to-transparent p-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-9 flex-1 sm:flex-none"
                  disabled={disabled || isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Upload className="size-4" />
                  )}
                  {t("replace")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 text-destructive hover:text-destructive"
                  disabled={disabled || isUploading}
                  onClick={handleRemove}
                >
                  <Trash2 className="size-4" />
                  {t("remove")}
                </Button>
              </div>
            </>
          ) : (
            <button
              type="button"
              className="flex h-full w-full flex-col items-center justify-center gap-3 px-4 py-6 text-center text-muted-foreground"
              disabled={disabled || isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <Loader2 className="size-10 animate-spin text-primary" />
              ) : (
                <ImageIcon className="size-10 opacity-40" strokeWidth={1.25} />
              )}
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{t("tapToUpload")}</p>
                <p className="text-xs leading-relaxed">{t("dragDropHint")}</p>
                <p className="text-xs text-muted-foreground/80">{t("constraints")}</p>
              </div>
            </button>
          )}
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row md:flex-col">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full gap-2 sm:h-10"
            disabled={disabled || isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {value ? t("replace") : t("chooseFile")}
          </Button>
          {value ? (
            <Button
              type="button"
              variant="ghost"
              className="h-11 w-full gap-2 text-destructive hover:text-destructive sm:h-10"
              disabled={disabled || isUploading}
              onClick={handleRemove}
            >
              <Trash2 className="size-4" />
              {t("remove")}
            </Button>
          ) : null}
        </div>
      </div>

      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        disabled={disabled || isUploading}
        onChange={handleFileChange}
      />
    </FormField>
  );
}
