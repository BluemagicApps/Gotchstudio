import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations, useLocale } from "next-intl";
import { type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { SmartImage } from "@/components/shared/SmartImage";
import { journal } from "@/data/journal";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "journal.meta" });
  return buildMetadata({
    locale,
    path: "/journal",
    title: t("title"),
    description: t("description"),
  });
}

export default async function JournalPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <JournalContent />;
}

function JournalContent() {
  const t = useTranslations("journal.hero");
  const tp = useTranslations("journal.post");
  const locale = useLocale();
  const [lead, ...rest] = journal;

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
      />

      <Section>
        {/* Featured lead post */}
        <Reveal>
          <Link
            href={`/journal/${lead.slug}`}
            className="group grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
          >
            <div className="relative aspect-[3/2] overflow-hidden">
              <SmartImage
                src={lead.cover}
                alt={lead.title}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
                className="img-zoom object-cover"
                wrapperClassName="h-full w-full"
              />
            </div>
            <div>
              <p className="eyebrow">{lead.category}</p>
              <h2 className="display-sm mt-4 transition-colors group-hover:text-accent">
                {lead.title}
              </h2>
              <p className="mt-4 text-muted-foreground">{lead.excerpt}</p>
              <p className="mt-6 text-sm text-muted-foreground">
                {tp("by")} {lead.author} · {formatDate(lead.date, locale)} ·{" "}
                {lead.readingTime} {tp("minRead")}
              </p>
            </div>
          </Link>
        </Reveal>

        {/* Grid */}
        <div className="mt-20 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.slug} delay={i % 3}>
              <Link href={`/journal/${post.slug}`} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <SmartImage
                    src={post.cover}
                    alt={post.title}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="img-zoom object-cover"
                    wrapperClassName="h-full w-full"
                  />
                </div>
                <p className="eyebrow mt-5">{post.category}</p>
                <h3 className="mt-3 font-serif text-xl font-light leading-snug transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {formatDate(post.date, locale)} · {post.readingTime}{" "}
                  {tp("minRead")}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
