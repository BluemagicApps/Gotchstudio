"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useConcierge } from "./useConcierge";

/**
 * Full-panel Design Concierge for the AI Studio. Same streaming engine as the
 * floating Chatbot (useConcierge → /api/chat), presented as a roomier
 * conversation surface within the studio's tabbed layout.
 */
export function ConciergePanel() {
  const t = useTranslations("ai.concierge");
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, streaming, send } = useConcierge(t("welcome"), t("error"));

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  function submit(text: string) {
    if (!text.trim() || streaming) return;
    setInput("");
    void send(text);
  }

  const last = messages[messages.length - 1];
  const awaitingFirstToken =
    streaming && last?.role === "assistant" && last.content === "";

  return (
    <div className="rounded-lg border border-border bg-card p-6 sm:p-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-light">{t("title")}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t("intro")}</p>
        </div>
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs text-accent sm:inline-flex">
          <Sparkles className="h-3.5 w-3.5" /> AI
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex h-[24rem] flex-col gap-3 overflow-y-auto rounded-md border border-border bg-background p-4"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[80%] whitespace-pre-wrap rounded-lg px-4 py-2.5 text-sm leading-relaxed",
              m.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted text-foreground",
            )}
          >
            {m.content ||
              (awaitingFirstToken && i === messages.length - 1 ? (
                <span className="inline-flex items-center gap-1 py-1">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                </span>
              ) : null)}
          </div>
        ))}
      </div>

      {messages.length <= 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {[t("suggest1"), t("suggest2"), t("suggest3")].map((s) => (
            <button
              key={s}
              onClick={() => submit(s)}
              className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="mt-4 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("placeholder")}
          className="h-12 flex-1 rounded-md border border-border bg-background px-4 text-sm outline-none focus:ring-1 focus:ring-ring"
        />
        <Button type="submit" disabled={streaming || !input.trim()} aria-label={t("send")}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
      <p className="mt-3 text-xs text-muted-foreground">{t("note")}</p>
    </div>
  );
}
