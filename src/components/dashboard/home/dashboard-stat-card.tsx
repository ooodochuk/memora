import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatCardProps {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
  suffix?: string;
  interactive?: boolean;
  compact?: boolean;
  className?: string;
}

export function DashboardStatCard({
  value,
  label,
  description,
  icon: Icon,
  suffix,
  interactive = true,
  compact = false,
  className,
}: DashboardStatCardProps) {
  const Tag = interactive ? "button" : "div";

  return (
    <Tag
      {...(interactive ? { type: "button" as const } : {})}
      disabled={!interactive}
      className={cn(
        "surface-card flex h-full w-full min-w-0 flex-col border border-border/50",
        compact
          ? "items-center p-2 text-center sm:rounded-2xl sm:p-2.5"
          : "min-h-[148px] p-4 text-left sm:min-h-[156px] sm:p-5",
        interactive && [
          "cursor-pointer transition-all duration-300",
          "hover:border-border hover:bg-accent/30",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        ],
        !interactive && "cursor-default",
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground",
          compact ? "mb-1 size-7 sm:mb-1.5 sm:size-8" : "mb-3 size-9",
        )}
      >
        <Icon className="size-3.5 sm:size-4" strokeWidth={1.75} aria-hidden />
      </div>

      <p
        className={cn(
          "font-heading font-medium tabular-nums leading-none tracking-tight",
          compact ? "text-lg sm:text-xl md:text-2xl" : "text-3xl sm:text-4xl",
        )}
      >
        {value}
        {suffix && (
          <span
            className={cn(
              "font-normal text-muted-foreground",
              compact
                ? "ml-0.5 text-xs sm:text-sm"
                : "ml-1 text-lg sm:text-xl",
            )}
          >
            {suffix}
          </span>
        )}
      </p>

      <p
        className={cn(
          "font-medium text-muted-foreground",
          compact
            ? "mt-0.5 text-[9px] leading-tight tracking-wide sm:mt-1 sm:text-[10px]"
            : "mt-2 text-xs tracking-wide",
        )}
      >
        {label}
      </p>

      <p
        className={cn(
          "text-muted-foreground",
          compact
            ? "mt-1 hidden text-[10px] leading-snug line-clamp-2 sm:block"
            : "mt-auto pt-2 text-xs leading-snug",
        )}
      >
        {description}
      </p>
    </Tag>
  );
}
