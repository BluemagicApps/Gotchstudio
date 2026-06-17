"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { mainNav } from "@/config/site";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-muted"
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background"
          >
            <div className="flex h-16 items-center justify-between px-6">
              <span className="font-serif text-xl tracking-wide">
                Gotch Studio
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 px-6 pt-8">
              {mainNav.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-border py-4 font-serif text-3xl font-light"
                  >
                    {t(item.key)}
                  </Link>
                </motion.div>
              ))}
              <Button asChild size="lg" className="mt-8">
                <Link href="/contact" onClick={() => setOpen(false)}>
                  {tc("bookConsultation")}
                </Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
