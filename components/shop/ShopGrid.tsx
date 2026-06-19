"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SmartImage } from "@/components/shared/SmartImage";
import { Reveal } from "@/components/shared/Reveal";
import { shopItems, shopCategories } from "@/data/shop";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 24;

export function ShopGrid() {
  const t = useTranslations("shop");
  const [category, setCategory] = useState<string>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered =
    category === "all"
      ? shopItems
      : shopItems.filter((i) => i.category === category);

  // Reset how many are shown when the category changes.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [category]);

  const shown = filtered.slice(0, visible);

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-border pb-8">
        <Chip
          active={category === "all"}
          onClick={() => setCategory("all")}
          label={t("filters.all")}
        />
        {shopCategories.map((c) => (
          <Chip
            key={c}
            active={category === c}
            onClick={() => setCategory(c)}
            label={c}
          />
        ))}
      </div>

      <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((item, i) => (
          <Reveal key={item.slug} delay={i % 3}>
            <article className="group">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <SmartImage
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="img-zoom object-cover"
                  wrapperClassName="h-full w-full"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg font-light">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("item.by")} {item.maker}
                  </p>
                </div>
                <span className="font-serif text-lg">
                  ${item.price.toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.description}
              </p>
              <button className="mt-3 text-sm tracking-wide link-underline">
                {t("item.inquire")}
              </button>
            </article>
          </Reveal>
        ))}
      </div>

      {visible < filtered.length && (
        <div className="mt-14 flex flex-col items-center gap-3">
          <p className="text-xs text-muted-foreground">
            {t("showing", { shown: shown.length, total: filtered.length })}
          </p>
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-full border border-foreground px-6 py-2.5 text-sm tracking-wide transition-colors hover:bg-foreground hover:text-background"
          >
            {t("loadMore")}
          </button>
        </div>
      )}

      <p className="mt-12 text-center text-xs text-muted-foreground">
        {t("item.note")}
      </p>
    </div>
  );
}

function Chip({
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
