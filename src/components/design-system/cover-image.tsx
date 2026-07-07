"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { COVER_PLACEHOLDER_CLASS, isMemoraUploadedUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";

interface CoverImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
}

export function CoverImage({
  src,
  alt,
  className,
  imageClassName,
  priority = false,
  sizes = "100vw",
}: CoverImageProps) {
  const hasImage = Boolean(src);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {hasImage ? (
        <Image
          src={src!}
          alt={alt}
          fill
          priority={priority}
          className={cn("object-cover", imageClassName)}
          sizes={sizes}
          unoptimized={isMemoraUploadedUrl(src!)}
        />
      ) : (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            COVER_PLACEHOLDER_CLASS,
          )}
          aria-hidden
        >
          <ImageIcon className="size-16 text-muted-foreground/30" strokeWidth={1} />
        </div>
      )}
    </div>
  );
}
