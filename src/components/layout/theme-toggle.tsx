"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export function ThemeToggle() {
 const { setTheme } = useTheme();
 const t = useTranslations("theme");
 const mounted = useSyncExternalStore(
  () => () => {},
  () => true,
  () => false,
 );

 if (!mounted) {
 return <Skeleton className="size-8 rounded-xl bg-muted" aria-hidden />;
 }

 return (
 <DropdownMenu>
 <DropdownMenuTrigger
 render={
 <Button variant="ghost" size="icon-sm" aria-label={t("label")} />
 }
 >
 <Sun className="size-4 rotate-0 scale-100 transition-all light:rotate-90 light:scale-0 dark:rotate-0 dark:scale-100" />
 <Moon className="absolute size-4 rotate-90 scale-0 transition-all light:rotate-0 light:scale-100 dark:-rotate-90 dark:scale-0" />
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end" className="bg-card border-border">
 <DropdownMenuItem onClick={() => setTheme("dark")}>
 <Moon className="size-4" />
 {t("dark")}
 </DropdownMenuItem>
 <DropdownMenuItem onClick={() => setTheme("light")}>
 <Sun className="size-4" />
 {t("light")}
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 );
}
