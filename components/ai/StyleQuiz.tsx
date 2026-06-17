"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, RotateCcw } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { designStyles } from "./styleData";
import { cn } from "@/lib/utils";

/** Quiz questions; each option maps to one or more style ids it favors. */
const questions = [
  {
    q: "Which word feels most like home?",
    options: [
      { label: "Serene", styles: ["warm-minimal", "wellness-sanctuary"] },
      { label: "Elegant", styles: ["classic-luxe"] },
      { label: "Breezy", styles: ["modern-coastal"] },
      { label: "Characterful", styles: ["collected-eclectic"] },
    ],
  },
  {
    q: "Pick a palette.",
    options: [
      { label: "Ivory & oak", styles: ["warm-minimal", "modern-coastal"] },
      { label: "Marble & brass", styles: ["classic-luxe"] },
      { label: "Plaster & green", styles: ["wellness-sanctuary"] },
      { label: "Jewel tones", styles: ["collected-eclectic"] },
    ],
  },
  {
    q: "Your ideal evening at home?",
    options: [
      { label: "A quiet bath & early night", styles: ["wellness-sanctuary"] },
      { label: "Hosting a dinner party", styles: ["classic-luxe", "collected-eclectic"] },
      { label: "Reading by the window", styles: ["warm-minimal"] },
      { label: "Sunset on the porch", styles: ["modern-coastal"] },
    ],
  },
  {
    q: "What draws your eye first in a room?",
    options: [
      { label: "Light & space", styles: ["warm-minimal", "wellness-sanctuary"] },
      { label: "Architecture & detail", styles: ["classic-luxe"] },
      { label: "Texture & material", styles: ["modern-coastal"] },
      { label: "Art & objects", styles: ["collected-eclectic"] },
    ],
  },
];

type Phase = "intro" | "quiz" | "result";

export function StyleQuiz() {
  const t = useTranslations("ai.quiz");
  const tm = useTranslations("ai.moodboard");
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  function answer(styleIds: string[]) {
    setScores((prev) => {
      const next = { ...prev };
      styleIds.forEach((id) => (next[id] = (next[id] ?? 0) + 1));
      return next;
    });
    if (step + 1 < questions.length) setStep(step + 1);
    else setPhase("result");
  }

  function reset() {
    setScores({});
    setStep(0);
    setPhase("intro");
  }

  const winner =
    Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    designStyles[0].id;
  const result = designStyles.find((s) => s.id === winner)!;

  async function share() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${window.location.pathname}#style-${winner}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 sm:p-10">
      <div className="mb-8">
        <h3 className="font-serif text-2xl font-light">{t("title")}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{t("intro")}</p>
      </div>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button onClick={() => setPhase("quiz")} variant="accent" size="lg">
              {t("start")}
            </Button>
          </motion.div>
        )}

        {phase === "quiz" && (
          <motion.div
            key={`q-${step}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">
                {step + 1}/{questions.length}
              </span>
            </div>
            <p className="font-serif text-2xl font-light">
              {questions[step].q}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {questions[step].options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => answer(opt.styles)}
                  className="rounded-md border border-border px-5 py-4 text-left text-sm transition-colors hover:border-accent hover:bg-muted"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div
            key="result"
            id={`style-${winner}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="eyebrow">{t("result")}</p>
            <h4 className="display-sm mt-2">
              {t("yourStyle")} <span className="text-accent">{result.name}</span>
            </h4>
            <p className="mt-3 max-w-lg text-muted-foreground">
              {result.description}
            </p>

            {/* Moodboard */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {result.moodboard.map((img) => (
                <div
                  key={img}
                  className="relative aspect-square overflow-hidden rounded-md"
                >
                  <Image
                    src={img}
                    alt={`${result.name} moodboard`}
                    fill
                    sizes="(max-width:640px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={share} variant="accent">
                {copied ? (
                  <>
                    <Check className="h-4 w-4" /> {tm("copied")}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> {tm("share")}
                  </>
                )}
              </Button>
              <Button onClick={reset} variant="outline">
                <RotateCcw className="h-4 w-4" /> {t("retake")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
