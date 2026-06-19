/**
 * Central AI configuration + capability detection.
 *
 * Every AI tool is built to degrade gracefully: when a key is absent the route
 * returns a tasteful, on-brand fallback (a scripted concierge reply, a curated
 * reference image, a static style profile) instead of erroring. This keeps the
 * site fully functional in development and on a fresh VPS before keys are set,
 * and "lights up" the moment the corresponding environment variable is present.
 */

/** Claude model used for the concierge + style profile. Override per-env. */
export const AI_MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

/** True when a Claude API key is configured (concierge + style profile go live). */
export const hasAnthropic = () => Boolean(process.env.ANTHROPIC_API_KEY);

/** True when a Replicate token is configured (room visualizer + staging go live). */
export const hasReplicate = () => Boolean(process.env.REPLICATE_API_TOKEN);

/**
 * Replicate model references (`owner/name:version`). These are env-overridable
 * because model versions on Replicate change over time — if a default version
 * is retired the route falls back to curated imagery until you set a current
 * one. `adirik/interior-design` is an interior-redesign (img2img + ControlNet)
 * model well suited to restyling an existing room photo.
 */
export const REPLICATE_VISUALIZE_MODEL =
  process.env.REPLICATE_VISUALIZE_MODEL ||
  "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38";

export const REPLICATE_STAGE_MODEL =
  process.env.REPLICATE_STAGE_MODEL || REPLICATE_VISUALIZE_MODEL;

/** Hard caps that protect cost + latency on the public AI endpoints. */
export const AI_LIMITS = {
  /** Max characters accepted in a single concierge user message. */
  maxChatChars: 2000,
  /** Max conversation turns kept as context (older turns are dropped). */
  maxChatHistory: 12,
  /** Max bytes for an uploaded (already client-downscaled) image data URL. */
  maxImageBytes: 6 * 1024 * 1024,
} as const;
