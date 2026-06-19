"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Check } from "lucide-react";

/**
 * Newsletter signup. Placeholder submit handler — wire to Mailchimp (or the
 * optional Node API) by replacing the body of `onSubmit`. See DEPLOYMENT.md.
 */
export function Newsletter({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: POST to Mailchimp / /api/subscribe. Mocked success for now.
    setDone(true);
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
    <form onSubmit={onSubmit} className="flex max-w-sm items-center gap-2">
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
        aria-label={t("submit")}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground/30 transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
