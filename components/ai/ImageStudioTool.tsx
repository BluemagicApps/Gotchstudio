"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Upload, Sparkles, RotateCcw, ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { designStyles } from "./styleData";
import { fileToDownscaledDataUrl } from "@/lib/ai/image-client";
import { ImageCompare } from "./ImageCompare";
import { cn } from "@/lib/utils";

type Phase = "upload" | "style" | "generating" | "result" | "error";

/**
 * Shared engine for the AI Room Visualizer and Virtual Staging tools. Uploads a
 * (client-downscaled) photo, lets the user pick a signature style, calls the
 * given image endpoint, and presents a draggable before/after comparison. The
 * only differences between the two tools are the endpoint and the copy
 * (i18n namespace) — everything else is identical.
 */
export function ImageStudioTool({
  endpoint,
  namespace,
  beforeLabel,
  afterLabel,
}: {
  endpoint: "/api/visualize" | "/api/stage";
  namespace: "ai.visualizer" | "ai.staging";
  beforeLabel: string;
  afterLabel: string;
}) {
  const t = useTranslations(namespace);
  const [phase, setPhase] = useState<Phase>("upload");
  const [uploaded, setUploaded] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const [styleId, setStyleId] = useState(designStyles[0].id);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeStyle = designStyles.find((s) => s.id === styleId)!;

  async function onFile(file?: File) {
    if (!file) return;
    try {
      const dataUrl = await fileToDownscaledDataUrl(file);
      setUploaded(dataUrl);
      setPhase("style");
    } catch {
      setPhase("error");
    }
  }

  async function generate() {
    if (!uploaded) return;
    setPhase("generating");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image: uploaded, styleId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { image?: string; demo?: boolean };
      if (!data.image) throw new Error("No image");
      setResult(data.image);
      setDemo(Boolean(data.demo));
      setPhase("result");
    } catch {
      setPhase("error");
    }
  }

  function reset() {
    setUploaded(null);
    setResult(null);
    setDemo(false);
    setPhase("upload");
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 sm:p-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-light">{t("title")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t("intro")}</p>
        </div>
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs text-accent sm:inline-flex">
          <Sparkles className="h-3.5 w-3.5" /> AI
        </span>
      </div>

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

      {phase === "style" && uploaded && (
        <div className="space-y-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={uploaded} alt="Your room" className="h-full w-full object-cover" />
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
          <div className="flex flex-wrap gap-3">
            <Button onClick={generate} variant="accent" size="lg">
              <Sparkles className="h-4 w-4" /> {t("generate")}
            </Button>
            <Button onClick={reset} variant="outline">
              <RotateCcw className="h-4 w-4" /> {t("reset")}
            </Button>
          </div>
        </div>
      )}

      {phase === "generating" && (
        <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-4 rounded-md bg-muted">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-sm text-muted-foreground">{t("generating")}</p>
        </div>
      )}

      {phase === "result" && uploaded && result && (
        <div className="space-y-6">
          <p className="eyebrow flex items-center gap-2">
            <ImageIcon className="h-4 w-4" /> {t("result")} — {activeStyle.name}
          </p>
          <ImageCompare
            before={uploaded}
            after={result}
            beforeLabel={beforeLabel}
            afterLabel={afterLabel}
          />
          <p className="text-center text-xs text-muted-foreground">
            {beforeLabel} ／ {afterLabel} · {activeStyle.name}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={reset} variant="outline">
              <RotateCcw className="h-4 w-4" /> {t("reset")}
            </Button>
          </div>
          {demo && <p className="text-xs text-muted-foreground">{t("note")}</p>}
        </div>
      )}

      {phase === "error" && (
        <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-4 rounded-md bg-muted text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground" strokeWidth={1.25} />
          <p className="max-w-sm text-sm text-muted-foreground">{t("error")}</p>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" /> {t("reset")}
          </Button>
        </div>
      )}

      {phase !== "result" && (
        <p className="mt-6 text-xs text-muted-foreground">{t("note")}</p>
      )}
    </div>
  );
}
