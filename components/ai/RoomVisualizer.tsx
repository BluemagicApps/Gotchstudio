"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Upload, Sparkles, RotateCcw, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { designStyles } from "./styleData";
import { cn } from "@/lib/utils";

type Phase = "upload" | "style" | "generating" | "result";

/**
 * AI Room Visualizer (demo). Accepts an uploaded image, lets the user pick a
 * signature style, simulates processing, then shows a curated "after" image.
 *
 * To go live: replace the timeout in `generate()` with a call to a serverless
 * route that forwards the uploaded image + style to Replicate / Hugging Face /
 * Spacely and returns the generated image URL.
 */
export function RoomVisualizer() {
  const t = useTranslations("ai.visualizer");
  const [phase, setPhase] = useState<Phase>("upload");
  const [uploaded, setUploaded] = useState<string | null>(null);
  const [styleId, setStyleId] = useState<string>(designStyles[0].id);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeStyle = designStyles.find((s) => s.id === styleId)!;

  function onFile(file?: File) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploaded(url);
    setPhase("style");
  }

  function generate() {
    setPhase("generating");
    // Demo: simulate model latency, then reveal a curated reference image.
    setTimeout(() => setPhase("result"), 2200);
  }

  function reset() {
    setUploaded(null);
    setPhase("upload");
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 sm:p-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-light">{t("title")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t("intro")}</p>
        </div>
        <span className="hidden shrink-0 rounded-full bg-accent/15 px-3 py-1 text-xs text-accent sm:inline">
          AI
        </span>
      </div>

      {/* Upload */}
      {phase === "upload" && (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
        >
          <Upload className="h-8 w-8" strokeWidth={1.25} />
          <span className="text-sm">{t("dragDrop")}</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </button>
      )}

      {/* Style picker */}
      {phase === "style" && uploaded && (
        <div className="space-y-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-md">
            {/* user upload preview (object URL → plain img) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={uploaded}
              alt="Your room"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="eyebrow mb-3">{t("chooseStyle")}</p>
            <div className="flex flex-wrap gap-2">
              {designStyles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyleId(s.id)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm transition-colors",
                    s.id === styleId
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
                  )}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={generate} variant="accent" size="lg">
            <Sparkles className="h-4 w-4" /> {t("generate")}
          </Button>
        </div>
      )}

      {/* Generating */}
      {phase === "generating" && (
        <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-4 rounded-md bg-muted">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-sm text-muted-foreground">{t("generating")}</p>
        </div>
      )}

      {/* Result */}
      {phase === "result" && (
        <div className="space-y-6">
          <p className="eyebrow flex items-center gap-2">
            <ImageIcon className="h-4 w-4" /> {t("result")} — {activeStyle.name}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={uploaded!}
                alt="Before"
                className="aspect-[4/3] w-full rounded-md object-cover"
              />
              <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                Before
              </figcaption>
            </figure>
            <figure>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
                <Image
                  src={activeStyle.preview}
                  alt={`${activeStyle.name} result`}
                  fill
                  sizes="(max-width:640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                After · {activeStyle.name}
              </figcaption>
            </figure>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={reset} variant="outline">
              <RotateCcw className="h-4 w-4" /> {t("reset")}
            </Button>
          </div>
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">{t("note")}</p>
    </div>
  );
}
