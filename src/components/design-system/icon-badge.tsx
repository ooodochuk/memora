import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type IconBadgeSize = "sm" | "md" | "lg";

interface IconBadgeProps {
 icon: LucideIcon;
 className?: string;
 iconClassName?: string;
 size?: IconBadgeSize;
 style?: React.CSSProperties;
 label?: string;
}

const sizeMap: Record<
 IconBadgeSize,
 { wrap: string; icon: string; stroke: number }
> = {
 sm: { wrap: "size-8", icon: "size-3.5", stroke: 1.75 },
 md: { wrap: "size-10", icon: "size-4", stroke: 1.75 },
 lg: { wrap: "size-12", icon: "size-5", stroke: 1.5 },
};

export function IconBadge({
 icon: Icon,
 className,
 iconClassName,
 size = "md",
 style,
 label,
}: IconBadgeProps) {
 const sizes = sizeMap[size];

 return (
 <span
 role={label ? "img" : undefined}
 aria-label={label}
 className={cn(
 "inline-flex shrink-0 items-center justify-center rounded-full transition-colors",
 sizes.wrap,
 className,
 )}
 style={style}
 >
 <Icon
 className={cn(sizes.icon, iconClassName)}
 strokeWidth={sizes.stroke}
 aria-hidden={!!label}
 />
 </span>
 );
}
