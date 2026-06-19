"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "@/components/shared/Reveal";
import {
  projects,
  projectStyles,
  projectTypes,
  type ProjectStyle,
  type ProjectType,
} from "@/data/projects";
import { cn } from "@/lib/utils";

/** Client-side filterable + searchable portfolio grid. */
const PAGE_SIZE = 12;

export function PortfolioGrid() {
  const t = useTranslations("portfolio.filters");
  const tp = useTranslations("portfolio");
  const [style, setStyle] = useState<ProjectStyle | "all">("all");
  const [type, setType] = useState<ProjectType | "all">("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (style !== "all" && p.style !== style) return false;
      if (type !== "all" && p.type !== type) return false;
      if (query) {
        const hay = `${p.title} ${p.location} ${p.style} ${p.type}`.toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [style, type, query]);

  // Reset how many are shown whenever the filter set changes.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [style, type, query]);

  const shown = filtered.slice(0, visible);
  const hasFilters = style !== "all" || type !== "all" || query !== "";

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-6 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs uppercase tracking-luxe text-muted-foreground">
            {t("style")}
          </span>
          <FilterChip
            active={style === "all"}
            onClick={() => setStyle("all")}
            label={t("all")}
          />
          {projectStyles.map((s) => (
            <FilterChip
              key={s}
              active={style === s}
              onClick={() => setStyle(s)}
              label={s}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs uppercase tracking-luxe text-muted-foreground">
            {t("type")}
          </span>
          <FilterChip
            active={type === "all"}
            onClick={() => setType("all")}
            label={t("all")}
          />
          {projectTypes.map((ty) => (
            <FilterChip
              key={ty}
              active={type === ty}
              onClick={() => setType(ty)}
              label={ty}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search")}
              aria-label={t("search")}
              className="h-10 w-full border-b border-border bg-transparent pl-6 text-sm outline-none focus:border-accent"
            />
          </div>
          {hasFilters && (
            <button
              onClick={() => {
                setStyle("all");
                setType("all");
                setQuery("");
              }}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" /> {t("clear")}
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-24 text-center text-muted-foreground">{t("empty")}</p>
      ) : (
        <>
          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => (
              <Reveal key={p.slug} delay={i % 3}>
                <ProjectCard project={p} priority={i < 3} />
              </Reveal>
            ))}
          </div>
          {visible < filtered.length && (
            <div className="mt-14 flex flex-col items-center gap-3">
              <p className="text-xs text-muted-foreground">
                {tp("showing", { shown: shown.length, total: filtered.length })}
              </p>
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="rounded-full border border-foreground px-6 py-2.5 text-sm tracking-wide transition-colors hover:bg-foreground hover:text-background"
              >
                {tp("loadMore")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
