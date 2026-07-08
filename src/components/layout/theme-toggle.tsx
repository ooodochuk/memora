"use client";

import { Check, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuGroup,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
 defaultAppThemes,
 editorialAppThemes,
 type AppThemeId,
} from "@/lib/design-system/themes";
import { cn } from "@/lib/utils";

function ThemeMenuItem({
 themeId,
 label,
 active,
 onSelect,
}: {
 themeId: AppThemeId;
 label: string;
 active: boolean;
 onSelect: (id: AppThemeId) => void;
}) {
 return (
 <DropdownMenuItem onClick={() => onSelect(themeId)} className="justify-between gap-3">
 <span>{label}</span>
 <Check className={cn("size-4 shrink-0", active ? "opacity-100" : "opacity-0")} />
 </DropdownMenuItem>
 );
}

export function ThemeToggle() {
 const { theme, setTheme } = useTheme();
 const t = useTranslations("theme");
 const mounted = useSyncExternalStore(
  () => () => {},
  () => true,
  () => false,
 );

 if (!mounted) {
 return <Skeleton className="size-8 rounded-xl bg-muted" aria-hidden />;
 }

 const activeTheme = (theme ?? "dark") as AppThemeId;

 return (
 <DropdownMenu>
 <DropdownMenuTrigger
 render={
 <Button variant="ghost" size="icon-sm" aria-label={t("label")} />
 }
 >
 <Palette className="size-4" />
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end" className="w-52 bg-card border-border">
 <DropdownMenuGroup>
 <DropdownMenuLabel>{t("groups.default")}</DropdownMenuLabel>
 {defaultAppThemes.map((item) => (
 <ThemeMenuItem
 key={item.id}
 themeId={item.id}
 label={t(`styles.${item.labelKey}`)}
 active={activeTheme === item.id}
 onSelect={setTheme}
 />
 ))}
 </DropdownMenuGroup>
 <DropdownMenuSeparator />
 <DropdownMenuGroup>
 <DropdownMenuLabel>{t("groups.editorial")}</DropdownMenuLabel>
 {editorialAppThemes.map((item) => (
 <ThemeMenuItem
 key={item.id}
 themeId={item.id}
 label={t(`styles.${item.labelKey}`)}
 active={activeTheme === item.id}
 onSelect={setTheme}
 />
 ))}
 </DropdownMenuGroup>
 </DropdownMenuContent>
 </DropdownMenu>
 );
}
