import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";

export async function SiteFooter() {
 const t = await getTranslations("footer");
 const year = new Date().getFullYear();

 return (
 <footer className="mt-auto border-t border-border bg-background">
 <Container className="py-10">
 <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
 <p className="text-sm text-muted-foreground">
 {t("copyright", { year })}
 </p>
 <div className="flex gap-6 text-sm text-muted-foreground">
 <span className="cursor-not-allowed opacity-60">{t("privacy")}</span>
 <span className="cursor-not-allowed opacity-60">{t("terms")}</span>
 </div>
 </div>
 </Container>
 </footer>
 );
}
