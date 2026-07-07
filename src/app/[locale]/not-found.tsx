import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default async function NotFoundPage() {
 const t = await getTranslations("notFound");

 return (
 <Container className="flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
 <p className="text-6xl font-heading font-medium text-muted-foreground/30">
 404
 </p>
 <h1 className="mt-4 font-heading text-2xl font-medium">{t("title")}</h1>
 <p className="mt-2 max-w-md text-muted-foreground">{t("description")}</p>
 <Button className="mt-8" render={<Link href="/" />}>
 {t("backHome")}
 </Button>
 </Container>
 );
}
