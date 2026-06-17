import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Leaf, HeartPulse, Gem } from "lucide-react";
import { type Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { SmartImage } from "@/components/shared/SmartImage";
import { Marquee } from "@/components/shared/Marquee";
import { CTA } from "@/components/sections/CTA";
import { team, awards, press } from "@/data/team";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return buildMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: t("description"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("about");
  const philosophy = [
    { key: "sustainability", icon: Leaf },
    { key: "wellness", icon: HeartPulse },
    { key: "timeless", icon: Gem },
  ] as const;

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        intro={t("hero.intro")}
      />

      {/* Story */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden">
              <SmartImage
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                alt="The Gotch Studio team at work"
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
                wrapperClassName="h-full w-full"
              />
            </div>
          </Reveal>
          <div>
            <p className="eyebrow mb-4">{t("story.eyebrow")}</p>
            <h2 className="display-sm">{t("story.title")}</h2>
            <p className="mt-6 text-muted-foreground">{t("story.body1")}</p>
            <p className="mt-4 text-muted-foreground">{t("story.body2")}</p>
            <p className="mt-4 text-muted-foreground">{t("story.body3")}</p>
          </div>
        </div>
      </Section>

      {/* Philosophy */}
      <Section className="bg-card">
        <SectionHeading
          eyebrow={t("philosophy.eyebrow")}
          title={t("philosophy.title")}
          align="center"
        />
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {philosophy.map((p, i) => (
            <Reveal key={p.key} delay={i}>
              <div className="h-full border border-border bg-background p-8 lg:p-10">
                <p.icon className="h-8 w-8 text-accent" strokeWidth={1.25} />
                <h3 className="mt-6 font-serif text-2xl font-light">
                  {t(`philosophy.items.${p.key}.title`)}
                </h3>
                <p className="mt-3 text-muted-foreground">
                  {t(`philosophy.items.${p.key}.body`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section>
        <SectionHeading
          eyebrow={t("team.eyebrow")}
          title={t("team.title")}
          intro={t("team.intro")}
        />
        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, i) => (
            <Reveal key={member.name} delay={i % 3}>
              <div className="group">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <SmartImage
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="img-zoom object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                    wrapperClassName="h-full w-full"
                  />
                </div>
                <h3 className="mt-4 font-serif text-xl font-light">
                  {member.name}
                </h3>
                <p className="text-sm text-accent">{member.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {member.bio}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Awards + press */}
      <Section className="bg-card">
        <SectionHeading
          eyebrow={t("awards.eyebrow")}
          title={t("awards.title")}
        />
        <div className="mt-12 divide-y divide-border border-y border-border">
          {awards.map((a) => (
            <div
              key={`${a.year}-${a.title}`}
              className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8"
            >
              <span className="w-16 shrink-0 font-serif text-xl text-accent">
                {a.year}
              </span>
              <span className="font-medium">{a.title}</span>
              <span className="text-sm text-muted-foreground sm:ml-auto">
                {a.org}
              </span>
            </div>
          ))}
        </div>

        <p className="eyebrow mt-16 mb-8 text-center">
          {t("awards.pressTitle")}
        </p>
        <Marquee items={press.map((p) => p.outlet)} />
      </Section>

      <CTA />
    </>
  );
}
