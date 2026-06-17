"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  defaultVariant,
  variants,
  type VariantId,
} from "@/config/variants";
import { useTheme } from "next-themes";

const VARIANT_STORAGE_KEY = "gotch-variant";

interface VariantContextValue {
  variant: VariantId;
  setVariant: (v: VariantId) => void;
}

const VariantContext = createContext<VariantContextValue>({
  variant: defaultVariant,
  setVariant: () => {},
});

export const useVariant = () => useContext(VariantContext);

/**
 * Applies the active variant by writing its token set onto <html> whenever the
 * variant OR the light/dark theme changes. The default variant's tokens are
 * already baked into globals.css, so non-default variants simply override them.
 */
export function VariantProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariantState] = useState<VariantId>(defaultVariant);
  const { resolvedTheme } = useTheme();

  // Restore persisted variant on mount.
  useEffect(() => {
    const stored = window.localStorage.getItem(
      VARIANT_STORAGE_KEY,
    ) as VariantId | null;
    if (stored && variants[stored]) setVariantState(stored);
  }, []);

  // Apply tokens for the active variant + theme.
  useEffect(() => {
    const def = variants[variant];
    const tokens =
      resolvedTheme === "dark" ? def.dark : def.light;
    const root = document.documentElement;

    for (const [key, value] of Object.entries(tokens)) {
      root.style.setProperty(`--${key}`, value);
    }
    root.style.setProperty("--radius", def.radius);
    root.style.setProperty(
      "--font-display",
      `"${def.fonts.display}", Georgia, serif`,
    );
    root.dataset.variant = variant;
  }, [variant, resolvedTheme]);

  const setVariant = useCallback((v: VariantId) => {
    setVariantState(v);
    window.localStorage.setItem(VARIANT_STORAGE_KEY, v);
  }, []);

  return (
    <VariantContext.Provider value={{ variant, setVariant }}>
      {children}
    </VariantContext.Provider>
  );
}
