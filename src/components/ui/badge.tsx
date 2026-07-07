import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
 "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
 {
 variants: {
 variant: {
 default: "bg-primary text-primary-foreground [a]:hover:bg-primary/90",
 secondary:
 "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
 warm: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
 tag: "border border-border bg-muted text-foreground [a]:hover:bg-accent",
 destructive:
 "bg-destructive/15 text-destructive [a]:hover:bg-destructive/20",
 outline: "border-border text-foreground [a]:hover:bg-accent",
 ghost: "hover:bg-accent hover:text-accent-foreground",
 link: "text-primary underline-offset-4 hover:underline",
 },
 size: {
 default: "h-6 px-2.5 text-xs",
 sm: "h-5 px-2 text-[0.6875rem]",
 lg: "h-7 px-3 text-sm",
 },
 },
 defaultVariants: {
 variant: "default",
 size: "default",
 },
 },
);

function Badge({
 className,
 variant = "default",
 size = "default",
 render,
 ...props
}: useRender.ComponentProps<"span"> &
 VariantProps<typeof badgeVariants>) {
 return useRender({
 defaultTagName: "span",
 props: mergeProps<"span">(
 {
 className: cn(badgeVariants({ variant, size }), className),
 },
 props,
 ),
 render,
 state: {
 slot: "badge",
 variant,
 },
 });
}

export { Badge, badgeVariants };
