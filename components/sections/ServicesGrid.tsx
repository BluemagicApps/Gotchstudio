"use client";

import { useTranslations } from "next-intl";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "./SectionHeading";
import { services } from "@/data/services";

/**
 * Service cards. When `home` is true it renders a compact teaser with a CTA;
 * otherwise it shows the full grid (used on the Services page).
 */
export function ServicesGrid({ home = false }: { home?: boolean }) {
  const t = useTranslations("home.services");
  const list = home ? services.slice(0, 6) : services;

  return (
    <Section className="bg-card">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          intro={t("intro")}
        />
        {home && (
          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-2 text-sm tracking-wide link-underline"
          >
            {t("cta")} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="mt-14 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {list.map((service, i) => {
          const Icon =
            (Icons[service.icon as keyof typeof Icons] as Icons.LucideIcon) ??
            Icons.Sparkles;
          return (
            <Reveal key={service.slug} delay={i % 3} as="div">
              <div className="group h-full bg-background p-8 transition-colors duration-500 hover:bg-card lg:p-10">
                <Icon
                  className="h-7 w-7 text-accent transition-transform duration-500 group-hover:-translate-y-1"
                  strokeWidth={1.25}
                />
                <h3 className="mt-6 font-serif text-2xl font-light">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {service.summary}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
