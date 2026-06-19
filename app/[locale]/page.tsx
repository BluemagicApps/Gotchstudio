import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { Hero } from "@/components/sections/Hero";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { AIToolsTeaser } from "@/components/sections/AIToolsTeaser";
import { Testimonials } from "@/components/sections/Testimonials";
import { JournalPreview } from "@/components/sections/JournalPreview";
import { CTA } from "@/components/sections/CTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/",
    title: `${siteConfig.name} — Timeless Interior Design`,
    description: siteConfig.description,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <AboutIntro />
      <ServicesGrid home />
      <FeaturedProjects />
      <AIToolsTeaser />
      <Testimonials />
      <JournalPreview />
      <CTA />
    </>
  );
}
