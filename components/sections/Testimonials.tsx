"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  const t = useTranslations("home.testimonials");
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  const go = (dir: number) =>
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);

  return (
    <Section className="bg-card" size="narrow">
      <div className="text-center">
        <p className="eyebrow mb-4">{t("eyebrow")}</p>
        <h2 className="display-sm">{t("title")}</h2>

        <Quote className="mx-auto mt-12 h-8 w-8 text-accent/50" />
        <div className="relative mt-6 min-h-[10rem]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-serif text-2xl font-light leading-snug sm:text-3xl">
                “{current.quote}”
              </p>
              <footer className="mt-8">
                <p className="font-medium">{current.name}</p>
                <p className="text-sm text-muted-foreground">
                  {current.detail}
                </p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-background"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-sm tabular-nums text-muted-foreground">
            {index + 1} / {testimonials.length}
          </span>
          <button
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:bg-background"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Section>
  );
}
