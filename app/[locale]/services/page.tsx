import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.meta" });
  return buildMetadata({
    locale,
    path: "/services",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicesContent />;
}

function ServicesContent() {
  const t = useTranslations("services");

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        intro={t("hero.intro")}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-20">
          {services.map((service, i) => {
            const Icon =
              (Icons[service.icon as keyof typeof Icons] as Icons.LucideIcon) ??
              Icons.Sparkles;
            return (
              <Reveal key={service.slug} delay={i % 2}>
                <article className="flex gap-6">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted text-accent">
                    <Icon className="h-6 w-6" strokeWidth={1.25} />
                  </span>
                  <div>
                    <h2 className="font-serif text-2xl font-light">
                      {service.title}
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                      {service.description}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {service.deliverables.map((d) => (
                        <li
                          key={d}
                          className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                        >
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <ProcessTimeline />

      {/* CTA */}
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="display-sm">{t("cta.title")}</h2>
          <p className="mt-5 text-muted-foreground">{t("cta.body")}</p>
          <Button asChild variant="accent" size="lg" className="mt-8">
            <Link href="/contact">
              {t("cta.button")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
