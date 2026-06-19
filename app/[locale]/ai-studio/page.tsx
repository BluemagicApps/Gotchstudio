import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { type Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/shared/Section";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RoomVisualizer } from "@/components/ai/RoomVisualizer";
import { VirtualStaging } from "@/components/ai/VirtualStaging";
import { VirtualTour } from "@/components/ai/VirtualTour";
import { StyleQuiz } from "@/components/ai/StyleQuiz";
import { ConciergePanel } from "@/components/ai/ConciergePanel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ai.meta" });
  return buildMetadata({
    locale,
    path: "/ai-studio",
    title: t("title"),
    description: t("description"),
  });
}

export default async function AIStudioPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AIContent />;
}

function AIContent() {
  const t = useTranslations("ai");

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        intro={t("hero.intro")}
      />

      <Section>
        <Tabs defaultValue="visualizer">
          <TabsList className="w-full justify-start sm:justify-center">
            <TabsTrigger value="visualizer">{t("visualizer.title")}</TabsTrigger>
            <TabsTrigger value="staging">{t("staging.title")}</TabsTrigger>
            <TabsTrigger value="tour">{t("tour.title")}</TabsTrigger>
            <TabsTrigger value="quiz">{t("quiz.title")}</TabsTrigger>
            <TabsTrigger value="concierge">{t("concierge.title")}</TabsTrigger>
          </TabsList>
          <TabsContent value="visualizer">
            <RoomVisualizer />
          </TabsContent>
          <TabsContent value="staging">
            <VirtualStaging />
          </TabsContent>
          <TabsContent value="tour">
            <VirtualTour />
          </TabsContent>
          <TabsContent value="quiz">
            <StyleQuiz />
          </TabsContent>
          <TabsContent value="concierge">
            <ConciergePanel />
          </TabsContent>
        </Tabs>
      </Section>
    </>
  );
}
