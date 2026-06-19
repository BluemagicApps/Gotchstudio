"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Lightweight consultation booking mock. Generates the next 14 weekdays and a
 * set of time slots. Replace `confirm()` with a Calendly/Cal.com embed or a
 * POST to the Node API to persist a Consultation row.
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

export function BookingWidget() {
  const t = useTranslations("contact.booking");
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const days = nextWeekdays(10);

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
                {d.toLocaleDateString("en", { weekday: "short" })}
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

      <Button
        onClick={() => setDone(true)}
        disabled={!date || !time}
        variant="accent"
        size="lg"
        className="mt-8"
      >
        {t("confirm")}
      </Button>
    </div>
  );
}
