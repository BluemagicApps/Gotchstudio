"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { SmartImage } from "@/components/shared/SmartImage";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

/** Editorial project card with hover reveal. */
export function ProjectCard({
  project,
  className,
  priority = false,
}: {
  project: Project;
  className?: string;
  priority?: boolean;
}) {
  const t = useTranslations("common");
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className={cn("group block", className)}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <SmartImage
          src={project.hero.url}
          alt={project.hero.alt}
          fill
          priority={priority}
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className="img-zoom object-cover"
          wrapperClassName="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute right-4 top-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-ivory/90 text-charcoal opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-light">{project.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {project.location}
          </p>
        </div>
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {project.style}
        </span>
      </div>
    </Link>
  );
}
