import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Section } from "@/components/shared/Section";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "./SectionHeading";
import { ProjectCard } from "@/components/project/ProjectCard";
import { featuredProjects } from "@/data/projects";

export function FeaturedProjects() {
  const t = useTranslations("home.featured");
  const projects = featuredProjects.slice(0, 6);

  return (
    <Section>
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          intro={t("intro")}
        />
        <Link
          href="/portfolio"
          className="inline-flex shrink-0 items-center gap-2 text-sm tracking-wide link-underline"
        >
          {t("cta")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i % 3}>
            <ProjectCard project={p} priority={i < 3} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
