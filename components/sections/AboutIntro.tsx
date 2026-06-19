import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { SmartImage } from "@/components/shared/SmartImage";
import { siteConfig } from "@/config/site";

const stats = [
  { key: "years", value: `${new Date().getFullYear() - siteConfig.founded}+` },
  { key: "projects", value: "320+" },
  { key: "countries", value: "18" },
  { key: "awards", value: "25+" },
] as const;

export function AboutIntro() {
  const t = useTranslations("home.about");
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden">
            <SmartImage
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
              alt="Serene designed living space with natural light"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
              wrapperClassName="h-full w-full"
            />
          </div>
        </Reveal>

        <div>
          <p className="eyebrow mb-4">{t("eyebrow")}</p>
          <h2 className="display-sm">{t("title")}</h2>
          <p className="mt-6 text-base text-muted-foreground sm:text-lg">
            {t("body1")}
          </p>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            {t("body2")}
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8">
            {stats.map((s) => (
              <div key={s.key}>
                <dt className="font-serif text-4xl font-light text-accent">
                  {s.value}
                </dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  {t(`stats.${s.key}`)}
                </dd>
              </div>
            ))}
          </dl>

          <Link
            href="/about"
            className="mt-10 inline-flex items-center gap-2 text-sm tracking-wide link-underline"
          >
            {t("cta")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
