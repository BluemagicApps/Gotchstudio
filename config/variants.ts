/**
 * The five aesthetic variants. Each variant is a complete palette + typography +
 * structural treatment that is applied at runtime by writing CSS custom
 * properties onto the document root (see components/providers/VariantProvider).
 *
 * Color values are HSL channel triples ("H S% L%") with no `hsl()` wrapper so
 * Tailwind can compose them with alpha (see tailwind.config.ts). Each variant
 * supplies both a `light` and `dark` token set.
 *
 * Palette discipline: deep charcoals, warm taupes, soft ivories, rich woods,
 * brass/gold, with optional emerald or navy highlights. No orange/yellow.
 */

export type VariantId =
  | "editorial"
  | "atelier"
  | "sanctuary"
  | "eclectic"
  | "minimal";

export type HeroStyle = "video" | "grid" | "layered" | "mosaic" | "statement";
export type NavStyle = "centered" | "split" | "minimal";

export interface VariantTokens {
  // Brand palette
  ivory: string;
  charcoal: string;
  taupe: string;
  wood: string;
  brass: string;
  emerald: string;
  navy: string;
  // Semantic (resolved per light/dark)
  background: string;
  foreground: string;
  muted: string;
  "muted-foreground": string;
  card: string;
  "card-foreground": string;
  border: string;
  input: string;
  ring: string;
  accent: string;
  "accent-foreground": string;
  primary: string;
  "primary-foreground": string;
}

export interface Variant {
  id: VariantId;
  /** Short label shown in the variant switcher. */
  name: string;
  /** One-line creative description. */
  blurb: string;
  hero: HeroStyle;
  nav: NavStyle;
  radius: string; // CSS value for --radius
  fonts: {
    /** Display/serif font family name (loaded in app/[locale]/layout.tsx). */
    display: string;
    body: string;
  };
  light: VariantTokens;
  dark: VariantTokens;
}

const NEUTRALS = {
  ivory: "40 33% 96%",
  charcoal: "30 8% 12%",
  taupe: "32 14% 64%",
  wood: "26 30% 38%",
  brass: "38 38% 55%",
  emerald: "162 32% 28%",
  navy: "215 38% 22%",
};

export const variants: Record<VariantId, Variant> = {
  // V1 — Timeless Editorial (default, fully polished)
  editorial: {
    id: "editorial",
    name: "Timeless Editorial",
    blurb: "Clean, narrative-driven, European-influenced calm.",
    hero: "video",
    nav: "centered",
    radius: "0.25rem",
    fonts: { display: "Cormorant Garamond", body: "Inter" },
    light: {
      ...NEUTRALS,
      background: "40 33% 96%",
      foreground: "30 8% 14%",
      muted: "36 20% 90%",
      "muted-foreground": "30 6% 40%",
      card: "40 33% 98%",
      "card-foreground": "30 8% 14%",
      border: "34 16% 84%",
      input: "34 16% 84%",
      ring: "38 38% 55%",
      accent: "38 38% 55%",
      "accent-foreground": "30 8% 12%",
      primary: "30 8% 14%",
      "primary-foreground": "40 33% 96%",
    },
    dark: {
      ...NEUTRALS,
      background: "30 9% 9%",
      foreground: "40 24% 90%",
      muted: "30 7% 16%",
      "muted-foreground": "34 12% 64%",
      card: "30 9% 12%",
      "card-foreground": "40 24% 90%",
      border: "30 7% 20%",
      input: "30 7% 20%",
      ring: "38 42% 58%",
      accent: "38 42% 58%",
      "accent-foreground": "30 9% 9%",
      primary: "40 24% 90%",
      "primary-foreground": "30 9% 9%",
    },
  },

  // V2 — Bold Modern Atelier (architectural, product-forward, navy accent)
  atelier: {
    id: "atelier",
    name: "Bold Modern Atelier",
    blurb: "Architectural, product-forward, confident lines.",
    hero: "grid",
    nav: "split",
    radius: "0rem",
    fonts: { display: "Fraunces", body: "Inter" },
    light: {
      ...NEUTRALS,
      background: "36 18% 93%",
      foreground: "30 9% 10%",
      muted: "34 12% 87%",
      "muted-foreground": "30 6% 36%",
      card: "0 0% 100%",
      "card-foreground": "30 9% 10%",
      border: "30 8% 80%",
      input: "30 8% 80%",
      ring: "215 38% 28%",
      accent: "215 38% 28%",
      "accent-foreground": "40 33% 96%",
      primary: "30 9% 10%",
      "primary-foreground": "36 18% 93%",
    },
    dark: {
      ...NEUTRALS,
      background: "220 16% 8%",
      foreground: "210 16% 90%",
      muted: "220 12% 15%",
      "muted-foreground": "214 10% 62%",
      card: "220 16% 11%",
      "card-foreground": "210 16% 90%",
      border: "220 10% 20%",
      input: "220 10% 20%",
      ring: "210 42% 58%",
      accent: "210 48% 60%",
      "accent-foreground": "220 16% 8%",
      primary: "210 16% 90%",
      "primary-foreground": "220 16% 8%",
    },
  },

  // V3 — Warm Sanctuary (wellness, soft layers, muted emerald)
  sanctuary: {
    id: "sanctuary",
    name: "Warm Sanctuary",
    blurb: "Wellness-led, soft layered, neuroaesthetic warmth.",
    hero: "layered",
    nav: "centered",
    radius: "1rem",
    fonts: { display: "Cormorant Garamond", body: "Inter" },
    light: {
      ...NEUTRALS,
      background: "34 28% 94%",
      foreground: "28 12% 18%",
      muted: "32 22% 88%",
      "muted-foreground": "28 8% 42%",
      card: "36 30% 97%",
      "card-foreground": "28 12% 18%",
      border: "32 18% 82%",
      input: "32 18% 82%",
      ring: "162 28% 34%",
      accent: "162 28% 34%",
      "accent-foreground": "34 28% 94%",
      primary: "28 14% 22%",
      "primary-foreground": "34 28% 94%",
    },
    dark: {
      ...NEUTRALS,
      background: "30 14% 10%",
      foreground: "36 20% 88%",
      muted: "30 10% 17%",
      "muted-foreground": "34 10% 64%",
      card: "30 14% 13%",
      "card-foreground": "36 20% 88%",
      border: "30 9% 22%",
      input: "30 9% 22%",
      ring: "162 30% 46%",
      accent: "162 30% 46%",
      "accent-foreground": "30 14% 10%",
      primary: "36 20% 88%",
      "primary-foreground": "30 14% 10%",
    },
  },

  // V4 — Global Eclectic (collected, travel, emerald accent)
  eclectic: {
    id: "eclectic",
    name: "Global Eclectic",
    blurb: "Collected, well-travelled, layered with character.",
    hero: "mosaic",
    nav: "split",
    radius: "0.5rem",
    fonts: { display: "Fraunces", body: "Inter" },
    light: {
      ...NEUTRALS,
      background: "38 30% 95%",
      foreground: "26 12% 15%",
      muted: "34 18% 88%",
      "muted-foreground": "26 8% 38%",
      card: "40 32% 98%",
      "card-foreground": "26 12% 15%",
      border: "32 16% 82%",
      input: "32 16% 82%",
      ring: "162 36% 30%",
      accent: "162 36% 30%",
      "accent-foreground": "38 30% 95%",
      primary: "26 12% 15%",
      "primary-foreground": "38 30% 95%",
    },
    dark: {
      ...NEUTRALS,
      background: "200 14% 9%",
      foreground: "38 18% 88%",
      muted: "200 10% 16%",
      "muted-foreground": "36 10% 62%",
      card: "200 14% 12%",
      "card-foreground": "38 18% 88%",
      border: "200 9% 21%",
      input: "200 9% 21%",
      ring: "162 38% 46%",
      accent: "162 38% 46%",
      "accent-foreground": "200 14% 9%",
      primary: "38 18% 88%",
      "primary-foreground": "200 14% 9%",
    },
  },

  // V5 — Minimal Maximalist (white space + statement imagery, brass)
  minimal: {
    id: "minimal",
    name: "Minimal Maximalist",
    blurb: "Generous white space, one unforgettable image.",
    hero: "statement",
    nav: "minimal",
    radius: "0.125rem",
    fonts: { display: "Cormorant Garamond", body: "Inter" },
    light: {
      ...NEUTRALS,
      background: "0 0% 99%",
      foreground: "0 0% 8%",
      muted: "0 0% 95%",
      "muted-foreground": "0 0% 40%",
      card: "0 0% 100%",
      "card-foreground": "0 0% 8%",
      border: "0 0% 88%",
      input: "0 0% 88%",
      ring: "38 38% 55%",
      accent: "38 38% 52%",
      "accent-foreground": "0 0% 8%",
      primary: "0 0% 8%",
      "primary-foreground": "0 0% 99%",
    },
    dark: {
      ...NEUTRALS,
      background: "0 0% 6%",
      foreground: "0 0% 92%",
      muted: "0 0% 13%",
      "muted-foreground": "0 0% 62%",
      card: "0 0% 9%",
      "card-foreground": "0 0% 92%",
      border: "0 0% 18%",
      input: "0 0% 18%",
      ring: "38 42% 58%",
      accent: "38 42% 58%",
      "accent-foreground": "0 0% 6%",
      primary: "0 0% 92%",
      "primary-foreground": "0 0% 6%",
    },
  },
};

export const variantList = Object.values(variants);
export const defaultVariant: VariantId = "editorial";

/** Serialize a token set into a CSS string for inline `style` injection. */
export function tokensToCss(tokens: VariantTokens): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens)) {
    out[`--${key}`] = value;
  }
  return out;
}
