"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { projectTypes } from "@/data/projects";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10),
});

type FormValues = z.infer<typeof schema>;

const budgets = ["< $50k", "$50k–$150k", "$150k–$500k", "$500k+"];

/**
 * Inquiry form. Submits to a placeholder handler; wire to the optional Node API
 * (server/) or a form service by replacing the body of `onSubmit`.
 */
export function ContactForm() {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    setFailed(false);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, locale, source: "contact-page" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSent(true);
    } catch {
      setFailed(true);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-lg border border-border bg-card p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Check className="h-6 w-6" />
        </span>
        <p className="font-serif text-xl font-light">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("name")} error={errors.name?.message}>
          <input className={inputCls} {...register("name")} />
        </Field>
        <Field label={t("email")} error={errors.email?.message}>
          <input type="email" className={inputCls} {...register("email")} />
        </Field>
        <Field label={t("phone")}>
          <input className={inputCls} {...register("phone")} />
        </Field>
        <Field label={t("location")}>
          <input className={inputCls} {...register("location")} />
        </Field>
        <Field label={t("type")}>
          <select className={inputCls} defaultValue="" {...register("type")}>
            <option value="" disabled>
              {t("selectType")}
            </option>
            {projectTypes.map((pt) => (
              <option key={pt} value={pt}>
                {pt}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("budget")}>
          <select className={inputCls} defaultValue="" {...register("budget")}>
            <option value="" disabled>
              {t("selectBudget")}
            </option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label={t("message")} error={errors.message?.message}>
        <textarea rows={5} className={cn(inputCls, "resize-none")} {...register("message")} />
      </Field>
      <div className="flex items-center gap-4">
        <Button type="submit" variant="accent" size="lg" disabled={isSubmitting}>
          {isSubmitting ? t("sending") : t("submit")}
        </Button>
        {failed && <span className="text-sm text-red-500">{t("error")}</span>}
      </div>
    </form>
  );
}

const inputCls =
  "h-11 w-full border-b border-border bg-transparent px-1 text-sm outline-none transition-colors focus:border-accent";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
