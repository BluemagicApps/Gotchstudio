"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Consultation booking. Collects a date + time slot and the visitor's contact
 * details, then POSTs to /api/consultation (which persists the appointment and
 * prevents double-booking the same slot).
 */
function nextWeekdays(count: number) {
  const days: Date[] = [];
  const d = new Date();
  while (days.length < count) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) days.push(new Date(d));
  }
  return days;
}

const slots = ["9:00", "10:30", "13:00", "14:30", "16:00"];

export function BookingWidget({ service }: { service?: string }) {
  const t = useTranslations("contact.booking");
  const locale = useLocale();
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const days = nextWeekdays(10);

  const ready = Boolean(date && time && name.trim() && email.trim());

  async function submit() {
    if (!ready || busy) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          service,
          date,
          slot: time,
          locale,
          source: service ? `service:${service}` : "booking-widget",
        }),
      });
      if (res.status === 409) {
        setError(t("conflict"));
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDone(true);
    } catch {
      setError(t("error"));
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-6">
        <Check className="h-5 w-5 text-accent" />
        <p className="text-sm">{t("confirmed")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 sm:p-8">
      <h3 className="font-serif text-2xl font-light">{t("title")}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{t("intro")}</p>

      <p className="eyebrow mb-3 mt-6">{t("selectDate")}</p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((d) => {
          const key = d.toISOString().slice(0, 10);
          return (
            <button
              key={key}
              onClick={() => setDate(key)}
              className={cn(
                "flex shrink-0 flex-col items-center rounded-md border px-4 py-3 text-sm transition-colors",
                date === key
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground",
              )}
            >
              <span className="text-xs uppercase">
                {d.toLocaleDateString(locale, { weekday: "short" })}
              </span>
              <span className="font-serif text-lg">{d.getDate()}</span>
            </button>
          );
        })}
      </div>

      <p className="eyebrow mb-3 mt-6">{t("selectTime")}</p>
      <div className="flex flex-wrap gap-2">
        {slots.map((s) => (
          <button
            key={s}
            onClick={() => setTime(s)}
            disabled={!date}
            className={cn(
              "rounded-md border px-4 py-2 text-sm transition-colors disabled:opacity-40",
              time === s
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:border-foreground",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow mb-2 block">{t("name")}</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 w-full border-b border-border bg-transparent px-1 text-sm outline-none focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="eyebrow mb-2 block">{t("email")}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full border-b border-border bg-transparent px-1 text-sm outline-none focus:border-accent"
          />
        </label>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Button onClick={submit} disabled={!ready || busy} variant="accent" size="lg">
          {busy ? t("sending") : t("confirm")}
        </Button>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    </div>
  );
}
