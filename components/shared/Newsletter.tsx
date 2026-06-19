"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Check } from "lucide-react";

/** Newsletter signup wired to the backend (/api/subscribe) with consent capture. */
export function Newsletter({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const t = useTranslations("newsletter");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || busy) return;
    setFailed(false);
    setBusy(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, locale, source: `newsletter-${variant}` }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDone(true);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Check className="h-4 w-4 text-accent" />
        {t("success")}
      </p>
    );
  }

  return (
    <div className="max-w-sm">
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          className="h-11 flex-1 border-b border-foreground/30 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground focus:border-accent"
        />
        <button
          type="submit"
          disabled={busy}
          aria-label={t("submit")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground/30 transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
      {failed && <p className="mt-2 text-xs text-red-500">{t("error")}</p>}
    </div>
  );
}
