import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Box, Scan, MessageCircle } from "lucide-react";
import { type Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RoomVisualizer } from "@/components/ai/RoomVisualizer";
import { StyleQuiz } from "@/components/ai/StyleQuiz";

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
  const more = [
    { key: "staging", icon: Scan },
    { key: "viewer", icon: Box },
    { key: "chatbot", icon: MessageCircle },
  ] as const;

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
            <TabsTrigger value="visualizer">
              {t("visualizer.title")}
            </TabsTrigger>
            <TabsTrigger value="quiz">{t("quiz.title")}</TabsTrigger>
          </TabsList>
          <TabsContent value="visualizer">
            <RoomVisualizer />
          </TabsContent>
          <TabsContent value="quiz">
            <StyleQuiz />
          </TabsContent>
        </Tabs>
      </Section>

      {/* In development */}
      <Section className="bg-card">
        <p className="eyebrow mb-10">{t("more.title")}</p>
        <div className="grid gap-6 md:grid-cols-3">
          {more.map((m, i) => (
            <Reveal key={m.key} delay={i}>
              <div className="h-full border border-border bg-background p-8">
                <m.icon className="h-7 w-7 text-accent" strokeWidth={1.25} />
                <h3 className="mt-5 font-serif text-xl font-light">
                  {t(`more.${m.key}`)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`more.${m.key}Desc`)}
                </p>
                <span className="mt-4 inline-block rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  Coming soon
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
