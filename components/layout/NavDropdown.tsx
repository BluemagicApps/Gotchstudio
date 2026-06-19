"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  label: string;
  description?: string;
  href: string;
  /** lucide-react icon name. */
  icon?: string;
}

/**
 * Hover-activated navigation dropdown (mega-menu) for the desktop header.
 *
 * Opens on mouse-enter / keyboard focus and closes on mouse-leave / blur, with a
 * short close delay so the cursor can travel from the trigger to the panel
 * without flicker. The panel is a DOM descendant of the hover container (and a
 * padded "bridge" sits between trigger and panel), so hovering the panel keeps
 * the menu open. The trigger itself remains a real link to the section page.
 */
export function NavDropdown({
  label,
  href,
  active,
  items,
  columns = 1,
}: {
  label: string;
  href: string;
  active: boolean;
  items: DropdownItem[];
  columns?: 1 | 2;
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openNow = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  }, []);
  const closeSoon = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 120);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocusCapture={openNow}
      onBlurCapture={closeSoon}
    >
      <Link
        href={href}
        aria-haspopup="true"
        aria-expanded={open}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        className={cn(
          "link-underline inline-flex items-center gap-1 text-sm tracking-wide transition-colors",
          active ? "text-foreground" : "text-foreground/70 hover:text-foreground",
        )}
      >
        {label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-300",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            // pt-4 is the invisible "bridge" between trigger and panel.
            className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4"
          >
            <div
              role="menu"
              className={cn(
                "rounded-lg border border-border bg-background/95 p-2 shadow-2xl backdrop-blur-md",
                columns === 2 ? "grid w-[36rem] grid-cols-2 gap-1" : "w-80",
              )}
            >
              {items.map((it) => {
                const Icon = it.icon
                  ? (Icons[it.icon as keyof typeof Icons] as Icons.LucideIcon)
                  : undefined;
                return (
                  <Link
                    key={it.href + it.label}
                    href={it.href}
                    role="menuitem"
                    className="group/item flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-muted"
                  >
                    {Icon && (
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-accent transition-colors group-hover/item:bg-background">
                        <Icon className="h-4 w-4" strokeWidth={1.25} />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block text-sm text-foreground">
                        {it.label}
                      </span>
                      {it.description && (
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {it.description}
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
