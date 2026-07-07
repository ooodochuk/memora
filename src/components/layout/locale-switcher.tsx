"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

export function LocaleSwitcher() {
 const t = useTranslations("locale");
 const locale = useLocale() as AppLocale;
 const router = useRouter();
 const pathname = usePathname();

 function switchLocale(nextLocale: AppLocale) {
 router.replace(pathname, { locale: nextLocale });
 }

 return (
 <DropdownMenu>
 <DropdownMenuTrigger
 render={
 <Button variant="ghost" size="icon-sm" aria-label={t("label")} />
 }
 >
 <Languages className="size-4" />
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
 {routing.locales.map((loc) => (
 <DropdownMenuItem
 key={loc}
 onClick={() => switchLocale(loc)}
 className={locale === loc ? "font-medium" : undefined}
 >
 {t(loc)}
 </DropdownMenuItem>
 ))}
 </DropdownMenuContent>
 </DropdownMenu>
 );
}
