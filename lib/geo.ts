import { countryToLocale, defaultLocale, type Locale, locales } from "@/i18n/routing";

export const LOCALE_STORAGE_KEY = "gotch-locale";

/**
 * Resolve the visitor's preferred locale exactly once, then persist it.
 *
 * Order of precedence:
 *   1. A previously stored choice (explicit switch or earlier detection).
 *   2. IP geolocation via ipapi.co (free, no key) mapped through countryToLocale.
 *   3. The browser's navigator.language.
 *   4. The default locale.
 *
 * Runs client-side only (static export has no request middleware). Network
 * failures degrade gracefully to navigator/default with no thrown errors.
 */
export async function detectLocale(): Promise<Locale> {
  if (typeof window === "undefined") return defaultLocale;

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && locales.includes(stored as Locale)) {
    return stored as Locale;
  }

  // Try IP geolocation, but never block the UI for more than ~2.5s.
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch("https://ipapi.co/json/", {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = (await res.json()) as { country_code?: string };
      const mapped = data.country_code && countryToLocale[data.country_code];
      if (mapped) return mapped;
    }
  } catch {
    // ignore — fall through to navigator/default
  }

  const nav = navigator.language?.slice(0, 2).toLowerCase();
  if (nav && locales.includes(nav as Locale)) return nav as Locale;

  return defaultLocale;
}

export function storeLocale(locale: Locale) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  // Mirror to a cookie so the preference is also available to any future
  // server/Node integration without re-detecting.
  document.cookie = `${LOCALE_STORAGE_KEY}=${locale};path=/;max-age=31536000;samesite=lax`;
}
