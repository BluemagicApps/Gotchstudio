"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { detectLocale, storeLocale } from "@/lib/geo";
import { type Locale } from "@/i18n/routing";

/**
 * On first visit only, detects the visitor's locale (stored pref → IP geo →
 * navigator → default) and, if it differs from the current locale, routes to
 * the matching localized path. Once a preference exists it never re-detects, so
 * manual language choices are always respected.
 */
export function LocaleDetector({ current }: { current: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const detected = await detectLocale();
      if (cancelled) return;
      storeLocale(detected);
      if (detected !== current) {
        router.replace(pathname, { locale: detected });
      }
    })();
    return () => {
      cancelled = true;
    };
    // Intentionally run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
