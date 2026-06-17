"use client";

import { Globe, Check } from "lucide-react";
import { useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  locales,
  localeMeta,
  usePathname,
  useRouter,
  type Locale,
} from "@/i18n/routing";
import { storeLocale } from "@/lib/geo";
import { cn } from "@/lib/utils";

/** Flag + native-name language switcher; persists the explicit choice. */
export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function change(next: Locale) {
    storeLocale(next);
    router.replace(pathname, { locale: next });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Change language"
        className="inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
      >
        <Globe className="h-[18px] w-[18px]" />
        <span className="hidden text-xs uppercase tracking-wide sm:inline">
          {locale}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => change(l)}
            className={cn(
              "flex cursor-pointer items-center justify-between gap-3",
              l === locale && "font-medium",
            )}
          >
            <span className="flex items-center gap-2.5">
              <span aria-hidden>{localeMeta[l].flag}</span>
              {localeMeta[l].label}
            </span>
            {l === locale && <Check className="h-3.5 w-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
