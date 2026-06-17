import { getRequestConfig } from "next-intl/server";
import type { AbstractIntlMessages } from "next-intl";
import { routing, defaultLocale } from "./routing";

type Dict = Record<string, unknown>;

/** Recursively merge a translation dict over the English base (English wins on gaps). */
function deepMerge(base: Dict, override: Dict): Dict {
  const out: Dict = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const baseValue = out[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      baseValue &&
      typeof baseValue === "object" &&
      !Array.isArray(baseValue)
    ) {
      out[key] = deepMerge(baseValue as Dict, value as Dict);
    } else {
      out[key] = value;
    }
  }
  return out;
}

/**
 * Loads messages for the active locale. English is always loaded first and used
 * as the deep fallback, so any key missing from a translated file renders in
 * English instead of throwing or showing a raw key.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && (routing.locales as readonly string[]).includes(requested)
      ? requested
      : defaultLocale;

  const en = (await import(`../messages/en.json`)).default as Dict;
  const messages =
    locale === defaultLocale
      ? en
      : deepMerge(
          en,
          (await import(`../messages/${locale}.json`)).default as Dict,
        );

  return { locale, messages: messages as AbstractIntlMessages };
});
