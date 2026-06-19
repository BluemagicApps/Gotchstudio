import { useTranslations, useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "./SectionHeading";
import { SmartImage } from "@/components/shared/SmartImage";
import { journal } from "@/data/journal";
import { formatDate } from "@/lib/utils";

export function JournalPreview() {
  const t = useTranslations("home.journal");
  const locale = useLocale();
  const posts = journal.slice(0, 3);

  return (
    <Section>
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
        <Link
          href="/journal"
          className="inline-flex shrink-0 items-center gap-2 text-sm tracking-wide link-underline"
        >
          {t("cta")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-14 grid gap-x-6 gap-y-10 md:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i}>
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
                {formatDate(post.date, locale)}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
