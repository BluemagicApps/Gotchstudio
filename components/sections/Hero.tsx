"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/shared/SmartImage";
import { useVariant } from "@/components/providers/VariantProvider";
import { variants } from "@/config/variants";
import { cn } from "@/lib/utils";

const HERO_IMG =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2400&q=80";
const HERO_IMG_2 =
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=80";
const HERO_IMG_3 =
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1400&q=80";

/**
 * Variant-aware hero. The default (editorial) is a full-bleed cinematic image
 * with a centered editorial headline; other variants restructure the same
 * content (grid, layered, mosaic, statement) so each aesthetic reads distinctly.
 */
export function Hero() {
  const t = useTranslations("home.hero");
  const { variant } = useVariant();
  const style = variants[variant].hero;

  if (style === "grid" || style === "mosaic") {
    return <SplitHero t={t} mosaic={style === "mosaic"} />;
  }

  // editorial (video), layered, statement → full-bleed treatment
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <SmartImage
          src={HERO_IMG}
          alt="Sunlit luxury living room with warm neutral tones"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          wrapperClassName="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/20 to-charcoal/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-ivory">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs uppercase tracking-luxe text-ivory/80"
        >
          {t("eyebrow")}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="display mt-6 text-ivory"
        >
          {t("title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-xl text-base text-ivory/85 sm:text-lg"
        >
          {t("subtitle")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button asChild variant="accent" size="lg">
            <Link href="/contact">
              {t("ctaPrimary")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-ivory/40 text-ivory hover:bg-ivory hover:text-charcoal"
          >
            <Link href="/portfolio">{t("ctaSecondary")}</Link>
          </Button>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-ivory/70">
        <span className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-luxe">
          {t("scroll")}
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </span>
      </div>
    </section>
  );
}

/** Split / mosaic layout for atelier + eclectic variants. */
function SplitHero({
  t,
  mosaic,
}: {
  t: ReturnType<typeof useTranslations>;
  mosaic: boolean;
}) {
  return (
    <section className="relative grid min-h-[100svh] grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center px-6 pt-28 pb-16 sm:px-12 lg:pt-16">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="eyebrow"
          >
            {t("eyebrow")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="display mt-6"
          >
            {t("title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg"
          >
            {t("subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button asChild variant="accent" size="lg">
              <Link href="/contact">
                {t("ctaPrimary")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/portfolio">{t("ctaSecondary")}</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      <div
        className={cn(
          "relative gap-2 p-2",
          mosaic ? "grid grid-cols-2 grid-rows-2" : "grid",
        )}
      >
        <SmartImage
          src={HERO_IMG}
          alt="Luxury interior"
          fill={!mosaic}
          width={mosaic ? 700 : undefined}
          height={mosaic ? 700 : undefined}
          priority
          sizes="(max-width:1024px) 100vw, 50vw"
          className="h-full w-full object-cover"
          wrapperClassName={cn("h-full w-full", mosaic && "row-span-2")}
        />
        {mosaic && (
          <>
            <SmartImage
              src={HERO_IMG_2}
              alt="Interior detail"
              width={700}
              height={350}
              className="h-full w-full object-cover"
              wrapperClassName="h-full w-full"
            />
            <SmartImage
              src={HERO_IMG_3}
              alt="Interior detail"
              width={700}
              height={350}
              className="h-full w-full object-cover"
              wrapperClassName="h-full w-full"
            />
          </>
        )}
      </div>
    </section>
  );
}
