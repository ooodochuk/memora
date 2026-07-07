import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
 "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
 {
 variants: {
 variant: {
 default: "bg-primary text-primary-foreground hover:bg-primary/90",
 outline:
 "border-border bg-background hover:bg-accent hover:text-accent-foreground",
 secondary:
 "bg-secondary text-secondary-foreground hover:bg-secondary/80",
 ghost: "hover:bg-accent hover:text-accent-foreground",
 warm: "bg-brand text-brand-foreground hover:bg-brand/92 active:bg-brand/88",
 destructive:
 "bg-destructive text-destructive-foreground hover:bg-destructive/90",
 link: "text-primary underline-offset-4 hover:underline",
 },
 size: {
 default: "h-10 gap-2 px-4 sm:h-9 sm:px-3.5",
 xs: "h-7 gap-1 rounded-md px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
 sm: "h-9 gap-1.5 rounded-md px-3 text-[0.8125rem] sm:h-8",
 lg: "h-11 gap-2 rounded-lg px-5 text-base sm:h-10",
 icon: "size-10 sm:size-9",
 "icon-sm": "size-9 rounded-md sm:size-8",
 "icon-lg": "size-11 sm:size-10",
 },
 },
 defaultVariants: {
 variant: "default",
 size: "default",
 },
 },
);

function Button({
 className,
 variant = "default",
 size = "default",
 render,
 nativeButton,
 ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
 return (
 <ButtonPrimitive
 data-slot="button"
 nativeButton={nativeButton ?? render == null}
 className={cn(buttonVariants({ variant, size, className }))}
 render={render}
 {...props}
 />
 );
}

export { Button, buttonVariants };
