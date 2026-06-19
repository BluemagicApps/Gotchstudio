import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import * as Icons from "lucide-react";
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react";
import { type Locale, routing, Link } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { SmartImage } from "@/components/shared/SmartImage";
import { Button } from "@/components/ui/button";
import { BookingWidget } from "@/components/contact/BookingWidget";
import { services } from "@/data/services";
import { getServiceDetail } from "@/data/service-details";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    services.map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = services.find((s) => s.slug === slug);
  const detail = getServiceDetail(slug);
  if (!service) return {};
  return buildMetadata({
    locale,
    path: `/services/${slug}`,
    title: `${service.title} — Interior Design Services`,
    description: service.summary,
    image: detail?.heroImage,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = services.find((s) => s.slug === slug);
  const detail = getServiceDetail(slug);
  if (!service || !detail) notFound();

  return <ServiceContent slug={slug} locale={locale} />;
}

function ServiceContent({ slug, locale }: { slug: string; locale: Locale }) {
  const t = useTranslations("services.detail");
  const tc = useTranslations("common");
  const service = services.find((s) => s.slug === slug)!;
  const detail = getServiceDetail(slug)!;
  const Icon =
    (Icons[service.icon as keyof typeof Icons] as Icons.LucideIcon) ??
    Icons.Sparkles;
  const related = services.filter((s) => s.slug !== slug).slice(0, 3);

  // Service schema (SEO / rich results).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.description,
    provider: {
      "@type": "InteriorDesignService",
      name: siteConfig.name,
      telephone: siteConfig.phone,
      email: siteConfig.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address.street,
        addressLocality: siteConfig.address.locality,
        addressRegion: siteConfig.address.region,
        postalCode: siteConfig.address.postalCode,
        addressCountry: siteConfig.address.country,
      },
      url: siteConfig.url,
    },
    areaServed: siteConfig.regions,
    url: `${siteConfig.url}/${locale}/services/${slug}`,
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: detail.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Hero */}
      <section className="relative flex min-h-[70svh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <SmartImage
            src={detail.heroImage}
            alt={service.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            wrapperClassName="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-charcoal/40" />
        </div>
        <Container className="relative z-10 pb-16 text-ivory">
          <Link
            href="/services"
            className="mb-6 inline-flex items-center gap-2 text-sm text-ivory/80 hover:text-ivory"
          >
            <ArrowLeft className="h-4 w-4" /> {t("back")}
          </Link>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ivory/15 text-ivory backdrop-blur">
            <Icon className="h-6 w-6" strokeWidth={1.25} />
          </span>
          <h1 className="display mt-5 text-ivory">{service.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ivory/85">{detail.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild variant="accent" size="lg">
              <Link href="#book">
                {t("bookCta")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-ivory/40 text-ivory hover:bg-ivory hover:text-charcoal"
            >
              <Link href="/contact">{t("inquireCta")}</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Overview + details sidebar */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">{t("overview")}</p>
            <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
              {detail.intro.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="space-y-8 rounded-lg border border-border bg-card p-8">
              <div>
                <p className="eyebrow mb-1">{t("timeline")}</p>
                <p className="text-sm text-muted-foreground">{detail.timeline}</p>
              </div>
              <div>
                <p className="eyebrow mb-1">{t("investment")}</p>
                <p className="text-sm text-muted-foreground">
                  {detail.investment}
                </p>
              </div>
              <div>
                <p className="eyebrow mb-3">{t("whatsIncluded")}</p>
                <ul className="space-y-2">
                  {service.deliverables.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <Button asChild variant="accent" className="w-full">
                <Link href="#book">{t("bookCta")}</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* How it works */}
      <Section className="bg-card">
        <p className="eyebrow mb-10">{t("howItWorks")}</p>
        <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
          {detail.howItWorks.map((step, i) => (
            <Reveal key={step.title} delay={i % 2} as="div">
              <div className="h-full bg-background p-8">
                <span className="font-serif text-3xl font-light text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-serif text-xl font-light">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Who it's for */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="eyebrow mb-4">{t("idealFor")}</p>
            <ul className="space-y-4">
              {detail.idealFor.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <p className="eyebrow mb-4">{t("faqTitle")}</p>
            <div className="divide-y divide-border border-y border-border">
              {detail.faqs.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg font-light">
                    {f.q}
                    <Plus className="h-4 w-4 shrink-0 text-accent transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Booking */}
      <Section id="book" className="bg-card" size="wide">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h2 className="display-sm">{t("bookTitle")}</h2>
            <p className="mt-4 text-muted-foreground">{t("bookIntro")}</p>
          </div>
          <BookingWidget />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("orInquire")}{" "}
            <Link href="/contact" className="link-underline text-foreground">
              {t("inquireCta")}
            </Link>
            .
          </p>
        </div>
      </Section>

      {/* Related services */}
      <Section>
        <p className="eyebrow mb-10">{t("related")}</p>
        <div className="grid gap-6 sm:grid-cols-3">
          {related.map((s) => {
            const RIcon =
              (Icons[s.icon as keyof typeof Icons] as Icons.LucideIcon) ??
              Icons.Sparkles;
            return (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group h-full border border-border bg-background p-8 transition-colors hover:border-accent/50"
              >
                <RIcon className="h-6 w-6 text-accent" strokeWidth={1.25} />
                <h3 className="mt-5 font-serif text-xl font-light">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm tracking-wide text-foreground">
                  {tc("learnMore")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
}
