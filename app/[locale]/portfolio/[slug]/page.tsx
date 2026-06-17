import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { type Locale, routing } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { buildMetadata, projectJsonLd } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { SmartImage } from "@/components/shared/SmartImage";
import { BeforeAfterSlider } from "@/components/project/BeforeAfterSlider";
import { Button } from "@/components/ui/button";
import { projects, getProject } from "@/data/projects";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return buildMetadata({
    locale,
    path: `/portfolio/${slug}`,
    title: project.title,
    description: project.summary,
    image: project.hero.url,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = getProject(slug);
  if (!project) notFound();

  return <ProjectContent slug={slug} locale={locale} />;
}

function ProjectContent({ slug, locale }: { slug: string; locale: Locale }) {
  const t = useTranslations("portfolio.project");
  const tc = useTranslations("common");
  const project = getProject(slug)!;
  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            projectJsonLd({
              title: project.title,
              description: project.summary,
              slug: project.slug,
              image: project.hero.url,
              locale,
            }),
          ),
        }}
      />

      {/* Hero */}
      <section className="relative flex min-h-[80svh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <SmartImage
            src={project.hero.url}
            alt={project.hero.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            wrapperClassName="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-charcoal/30" />
        </div>
        <Container className="relative z-10 pb-16 text-ivory">
          <Link
            href="/portfolio"
            className="mb-6 inline-flex items-center gap-2 text-sm text-ivory/80 hover:text-ivory"
          >
            <ArrowLeft className="h-4 w-4" /> {tc("backTo")} {tc("viewAll")}
          </Link>
          <p className="text-xs uppercase tracking-luxe text-ivory/80">
            {project.location} · {project.year}
          </p>
          <h1 className="display mt-4 text-ivory">{project.title}</h1>
        </Container>
      </section>

      {/* Overview + details */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">{t("overview")}</p>
            <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
              {project.story.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="space-y-8 border-l border-border pl-8">
              <DetailRow label={t("location")} value={project.location} />
              <DetailRow label={t("year")} value={String(project.year)} />
              <DetailRow label={t("style")} value={project.style} />
              <DetailRow label={t("type")} value={project.type} />
              <div>
                <p className="eyebrow mb-3">{t("scope")}</p>
                <ul className="space-y-2">
                  {project.scope.map((s) => (
                    <li key={s} className="text-sm text-muted-foreground">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Before / After */}
      {project.beforeAfter && (
        <Section className="bg-card" size="wide">
          <p className="eyebrow mb-8 text-center">{t("beforeAfter")}</p>
          <Reveal>
            <BeforeAfterSlider
              before={project.beforeAfter.before}
              after={project.beforeAfter.after}
            />
          </Reveal>
        </Section>
      )}

      {/* Gallery */}
      <Section size="wide">
        <p className="eyebrow mb-8">{t("gallery")}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {project.gallery.map((img, i) => (
            <Reveal
              key={img.url}
              delay={i % 2}
              className={i % 3 === 0 ? "sm:col-span-2" : ""}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <SmartImage
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover"
                  wrapperClassName="h-full w-full"
                />
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t("view360")}
        </p>
      </Section>

      {/* Next + CTA */}
      <Section className="border-t border-border">
        <div className="flex flex-col items-center gap-8 text-center">
          <Button asChild variant="accent" size="lg">
            <Link href="/contact">
              {t("cta")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Link
            href={`/portfolio/${next.slug}`}
            className="group inline-flex items-center gap-2 text-sm tracking-wide"
          >
            {t("next")}: {next.title}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Section>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow mb-1">{label}</p>
      <p className="font-serif text-lg">{value}</p>
    </div>
  );
}
