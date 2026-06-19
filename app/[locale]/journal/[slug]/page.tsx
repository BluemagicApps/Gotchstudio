import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { type Locale, routing } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { SmartImage } from "@/components/shared/SmartImage";
import { journal, getPost } from "@/data/journal";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    journal.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return buildMetadata({
    locale,
    path: `/journal/${slug}`,
    title: post.title,
    description: post.excerpt,
    image: post.cover,
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!getPost(slug)) notFound();
  return <PostContent slug={slug} />;
}

function PostContent({ slug }: { slug: string }) {
  const t = useTranslations("journal.post");
  const locale = useLocale();
  const post = getPost(slug)!;
  const related = journal.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <article>
      <Container size="narrow" className="pt-36 sm:pt-44">
        <Link
          href="/journal"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t("back")}
        </Link>
        <p className="eyebrow">{post.category}</p>
        <h1 className="display mt-4">{post.title}</h1>
        <p className="mt-6 text-sm text-muted-foreground">
          {t("by")} {post.author} · {formatDate(post.date, locale)} ·{" "}
          {post.readingTime} {t("minRead")}
        </p>
      </Container>

      <Container size="wide" className="mt-12">
        <div className="relative aspect-[16/9] overflow-hidden">
          <SmartImage
            src={post.cover}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            wrapperClassName="h-full w-full"
          />
        </div>
      </Container>

      <Container size="narrow" className="py-16 sm:py-20">
        <div className="space-y-6 text-lg leading-relaxed text-foreground/90">
          {post.body.map((para, i) => (
            <p key={i} className={i === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.8]" : ""}>
              {para}
            </p>
          ))}
        </div>
      </Container>

      {/* Related */}
      <Section className="bg-card">
        <p className="eyebrow mb-10">{t("related")}</p>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-3">
          {related.map((p, i) => (
            <Reveal key={p.slug} delay={i}>
              <Link href={`/journal/${p.slug}`} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <SmartImage
                    src={p.cover}
                    alt={p.title}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="img-zoom object-cover"
                    wrapperClassName="h-full w-full"
                  />
                </div>
                <h3 className="mt-4 font-serif text-lg font-light leading-snug transition-colors group-hover:text-accent">
                  {p.title}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </article>
  );
}
