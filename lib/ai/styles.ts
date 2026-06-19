import { designStyles, type DesignStyle } from "@/components/ai/styleData";

/**
 * Maps each signature style to the descriptive language an image model needs.
 * Keyed by the same ids used across the Room Visualizer, Style Quiz, and
 * Virtual Staging so the whole AI Studio speaks one vocabulary.
 */
const STYLE_PROMPTS: Record<string, string> = {
  "warm-minimal":
    "warm minimalist interior, soft ivory and natural oak, uncluttered, diffused daylight, linen and wool textures, calm and serene, high-end editorial photography",
  "classic-luxe":
    "classic luxe interior, timeless elegance, marble, polished brass, crown moulding, richly layered neutrals, bespoke millwork, sophisticated and refined",
  "modern-coastal":
    "modern coastal interior, breezy and light, white oak, lime-wash walls, barely-there color, natural light, relaxed luxury, airy and fresh",
  "collected-eclectic":
    "collected eclectic interior, layered and well-travelled, mix of vintage and modern, bold jewel tones, characterful art and objects, curated maximalism",
  "wellness-sanctuary":
    "wellness sanctuary interior, tactile plaster walls, biophilic greenery, circadian natural light, soft organic forms, neuroaesthetic calm, spa-like serenity",
};

const NEGATIVE_PROMPT =
  "lowres, blurry, distorted proportions, warped furniture, extra walls, watermark, text, signature, cartoon, cluttered, oversaturated, deformed";

export function getStyle(styleId: string): DesignStyle {
  return designStyles.find((s) => s.id === styleId) ?? designStyles[0];
}

/** Prompt for restyling an EXISTING furnished room into the chosen aesthetic. */
export function visualizePrompt(styleId: string): {
  prompt: string;
  negative_prompt: string;
} {
  const style = getStyle(styleId);
  const descriptor = STYLE_PROMPTS[style.id] ?? STYLE_PROMPTS["warm-minimal"];
  return {
    prompt: `A beautifully redesigned interior of this exact room in a ${style.name} style: ${descriptor}. Keep the room's architecture, windows, and proportions; restyle the furnishings, materials, color palette, and decor.`,
    negative_prompt: NEGATIVE_PROMPT,
  };
}

/** Prompt for FURNISHING an empty room in the chosen aesthetic. */
export function stagePrompt(styleId: string): {
  prompt: string;
  negative_prompt: string;
} {
  const style = getStyle(styleId);
  const descriptor = STYLE_PROMPTS[style.id] ?? STYLE_PROMPTS["warm-minimal"];
  return {
    prompt: `Fully furnish this empty room in a ${style.name} style: ${descriptor}. Add tasteful furniture, lighting, rugs, art, and styling appropriate to the room; preserve the existing walls, windows, and floor plan.`,
    negative_prompt: NEGATIVE_PROMPT,
  };
}

export const styleIds = designStyles.map((s) => s.id);
