import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { type Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/shared/Section";
import { PortfolioGrid } from "@/components/project/PortfolioGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio.meta" });
  return buildMetadata({
    locale,
    path: "/portfolio",
    title: t("title"),
    description: t("description"),
  });
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PortfolioContent />;
}

function PortfolioContent() {
  const t = useTranslations("portfolio.hero");
  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
      />
      <Section>
        <PortfolioGrid />
      </Section>
    </>
  );
}
