import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface JournalCardProps {
 children: ReactNode;
 className?: string;
 hover?: boolean;
 padding?: "none" | "sm" | "md" | "lg";
 as?: "div" | "article";
 variant?: "default" | "photo";
}

const paddingMap = {
 none: "",
 sm: "p-4 sm:p-5",
 md: "p-5 sm:p-6",
 lg: "p-6 sm:p-8",
};

export function JournalCard({
 children,
 className,
 hover = false,
 padding = "none",
 as: Component = "div",
 variant = "default",
}: JournalCardProps) {
 return (
 <Component
 className={cn(
 "overflow-hidden rounded-xl",
 variant === "photo"
 ? "bg-card"
 : "surface-card border border-border/50",
 hover &&
 "motion-safe:transition-[background-color,box-shadow] motion-safe:duration-200 hover:bg-accent/35",
 paddingMap[padding],
 className,
 )}
 >
 {children}
 </Component>
 );
}

interface JournalCardMediaProps {
 children: ReactNode;
 className?: string;
 aspect?: "video" | "photo" | "wide" | "square" | "cinematic";
}

const aspectMap = {
 video: "aspect-[16/10]",
 photo: "aspect-[4/3]",
 wide: "aspect-[21/9]",
 square: "aspect-square",
 cinematic: "aspect-[3/4] sm:aspect-[4/5]",
};

export function JournalCardMedia({
 children,
 className,
 aspect = "photo",
}: JournalCardMediaProps) {
 return (
 <div
 className={cn(
 "relative overflow-hidden bg-muted",
 aspectMap[aspect],
 className,
 )}
 >
 {children}
 </div>
 );
}

interface JournalCardBodyProps {
 children: ReactNode;
 className?: string;
}

export function JournalCardBody({ children, className }: JournalCardBodyProps) {
 return (
 <div className={cn("space-y-3 p-4 sm:space-y-4 sm:p-5", className)}>
 {children}
 </div>
 );
}
