import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { type Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/shared/Section";
import { ShopGrid } from "@/components/shop/ShopGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shop.meta" });
  return buildMetadata({
    locale,
    path: "/shop",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ShopContent />;
}

function ShopContent() {
  const t = useTranslations("shop.hero");
  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
      />
      <Section>
        <ShopGrid />
      </Section>
    </>
  );
}
