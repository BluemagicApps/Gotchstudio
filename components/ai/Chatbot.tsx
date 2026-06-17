"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

/**
 * Floating design concierge. Responses are scripted (keyword-matched) for the
 * demo. To make it live, replace `mockReply` with a fetch to a serverless
 * endpoint that calls the Claude API — see server/README.md.
 */
function mockReply(input: string): string {
  const q = input.toLowerCase();
  if (q.includes("price") || q.includes("cost") || q.includes("budget"))
    return "Every project is bespoke, so investment varies with scope. Most full-service residential projects begin in the six figures; e-Design and virtual consultations start far lower. Share a few details on the contact page and we'll give you a tailored range.";
  if (q.includes("process") || q.includes("how"))
    return "Our process spans six phases: Discovery, Concept, Design Development, Procurement, Installation, and Reveal & Aftercare. You can see each step on the Services page.";
  if (q.includes("international") || q.includes("global") || q.includes("where"))
    return "We're based in Jersey City and work across all 50 US states, as well as Europe, the Middle East, and Asia. Remote e-Design is available anywhere.";
  if (q.includes("service"))
    return "We offer residential and commercial design, new build & renovation, kitchen & bath, furnishings procurement, e-Design, virtual consultations, and AI-enhanced design.";
  if (q.includes("ai") || q.includes("visualiz"))
    return "Our AI Studio lets you reimagine your room in our signature styles, take a style quiz, and build a moodboard. Find it in the navigation under 'AI Studio'.";
  return "Thank you for reaching out! I can help with our services, process, locations, or the AI Studio. For anything specific, the contact page connects you directly with our team.";
}

export function Chatbot() {
  const t = useTranslations("chatbot");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: t("welcome") }]);
    }
  }, [open, messages.length, t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", content: mockReply(text) }]);
    }, 500);
  }

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
                    "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                    m.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.content}
                </div>
              ))}
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {[t("suggest1"), t("suggest2"), t("suggest3")].map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
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
                send(input);
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
                  aria-label={t("send")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground"
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
