import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

/**
 * Supported locales. English is the authored default; every other locale falls
 * back to English for any missing key (configured in i18n/request.ts).
 */
export const locales = [
  "en",
  "de",
  "es",
  "pt",
  "fr",
  "zh",
  "ja",
  "nl",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Display metadata for the language switcher (flag emoji + native label). */
export const localeMeta: Record<Locale, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇺🇸" },
  de: { label: "Deutsch", flag: "🇩🇪" },
  es: { label: "Español", flag: "🇪🇸" },
  pt: { label: "Português", flag: "🇧🇷" },
  fr: { label: "Français", flag: "🇫🇷" },
  zh: { label: "中文", flag: "🇨🇳" },
  ja: { label: "日本語", flag: "🇯🇵" },
  nl: { label: "Nederlands", flag: "🇳🇱" },
};

/**
 * Map an ISO country code (from ipapi.co) to a supported locale. Anything not
 * listed falls back to the default locale.
 */
export const countryToLocale: Record<string, Locale> = {
  DE: "de",
  AT: "de",
  CH: "de",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  BR: "pt",
  PT: "pt",
  FR: "fr",
  BE: "fr",
  CN: "zh",
  TW: "zh",
  HK: "zh",
  JP: "ja",
  NL: "nl",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
