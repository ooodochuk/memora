import { getTranslations } from "next-intl/server";
import { PageContainer } from "@/components/design-system/page-container";
import { DesignConceptPreviewCard } from "@/components/design-system/design-concept-preview-card";
import { Heading, Lead } from "@/components/design-system/typography";
import {
  darkDesignConcepts,
  designConcepts,
  lightDesignConcepts,
} from "@/lib/design-system/concepts";

export default async function DesignConceptsPage() {
  const t = await getTranslations("designConcepts");

  return (
    <PageContainer size="dashboard" className="py-10 sm:py-14">
      <header className="mb-10 max-w-3xl">
        <Heading as="h1">{t("title")}</Heading>
        <Lead className="mt-3">{t("description")}</Lead>
        <p className="mt-2 text-sm text-muted-foreground">{t("note")}</p>
      </header>

      <section className="mb-12">
        <h2 className="mb-4 text-lg font-semibold">{t("lightThemes")}</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {lightDesignConcepts.map((concept) => (
            <DesignConceptPreviewCard key={concept.id} concept={concept} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">{t("darkThemes")}</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {darkDesignConcepts.map((concept) => (
            <DesignConceptPreviewCard key={concept.id} concept={concept} />
          ))}
        </div>
      </section>

      <p className="mt-10 text-xs text-muted-foreground">
        {t("tokenCount", { count: designConcepts.length })}
      </p>
    </PageContainer>
  );
}
