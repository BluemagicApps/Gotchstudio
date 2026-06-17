"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { mainNav } from "@/config/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { VariantSwitcher } from "./VariantSwitcher";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/button";

export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-6 sm:px-8 lg:h-20">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl font-light tracking-[0.12em] sm:text-2xl"
        >
          GOTCH<span className="text-accent">.</span>STUDIO
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {mainNav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "link-underline text-sm tracking-wide transition-colors",
                  active
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground",
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <VariantSwitcher />
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild size="sm" className="ml-2 hidden xl:inline-flex">
            <Link href="/contact">{tc("bookConsultation")}</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
