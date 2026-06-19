"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useConcierge } from "./useConcierge";

/**
 * Floating Design Concierge. Streams live answers from /api/chat (Claude),
 * grounded in the studio's own services, process, and work. When no Claude key
 * is configured the same endpoint returns a scripted reply, so this UI is
 * unchanged either way.
 */
export function Chatbot() {
  const t = useTranslations("chatbot");
  const [open, setOpen] = useState(false);
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

  // A streaming reply that hasn't produced text yet → show typing dots.
  const last = messages[messages.length - 1];
  const awaitingFirstToken =
    streaming && last?.role === "assistant" && last.content === "";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("title")}
        className="fixed bottom-6 right-6 z-[55] inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-[55] flex h-[28rem] w-[min(22rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="font-serif text-lg">{t("title")}</span>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm",
                    m.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.content ||
                    (awaitingFirstToken && i === messages.length - 1 ? (
                      <TypingDots />
                    ) : null)}
                </div>
              ))}
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {[t("suggest1"), t("suggest2"), t("suggest3")].map((s) => (
                    <button
                      key={s}
                      onClick={() => submit(s)}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="border-t border-border p-3"
            >
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("placeholder")}
                  className="h-10 flex-1 rounded-md bg-muted px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
                />
                <button
                  type="submit"
                  disabled={streaming || !input.trim()}
                  aria-label={t("send")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">
                {t("disclaimer")}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}
