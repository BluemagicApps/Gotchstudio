"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { mainNav } from "@/config/site";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import { NavDropdown, type DropdownItem } from "./NavDropdown";
import { Button } from "@/components/ui/button";

export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const ta = useTranslations("ai");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Hover-dropdown contents for the two nav items that have sub-pages/tools.
  const servicesItems: DropdownItem[] = services.map((s) => ({
    label: s.title,
    description: s.summary,
    href: `/services/${s.slug}`,
    icon: s.icon,
  }));
  const aiItems: DropdownItem[] = [
    { label: ta("visualizer.title"), description: ta("visualizer.intro"), href: "/ai-studio#visualizer", icon: "Wand2" },
    { label: ta("staging.title"), description: ta("staging.intro"), href: "/ai-studio#staging", icon: "Sofa" },
    { label: ta("tour.title"), description: ta("tour.intro"), href: "/ai-studio#tour", icon: "Compass" },
    { label: ta("quiz.title"), description: ta("quiz.intro"), href: "/ai-studio#quiz", icon: "Sparkles" },
    { label: ta("concierge.title"), description: ta("concierge.intro"), href: "/ai-studio#concierge", icon: "MessageCircle" },
  ];

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
          className="font-serif text-2xl font-semibold uppercase leading-none tracking-[0.2em] drop-shadow-sm transition-colors hover:text-accent sm:text-3xl lg:text-[2rem]"
        >
          GOTCH<span className="text-accent">.</span>STUDIO
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {mainNav.map((item) => {
            const active = pathname.startsWith(item.href);
            if (item.key === "services")
              return (
                <NavDropdown
                  key={item.key}
                  label={t(item.key)}
                  href={item.href}
                  active={active}
                  items={servicesItems}
                  columns={2}
                />
              );
            if (item.key === "aiStudio")
              return (
                <NavDropdown
                  key={item.key}
                  label={t(item.key)}
                  href={item.href}
                  active={active}
                  items={aiItems}
                />
              );
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
