import Anthropic from "@anthropic-ai/sdk";

/**
 * Lazily-instantiated, module-scoped Anthropic client. Created on first use so
 * importing this module never throws when `ANTHROPIC_API_KEY` is unset — callers
 * gate on `hasAnthropic()` (see ./env) before reaching for the client.
 */
let client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}
