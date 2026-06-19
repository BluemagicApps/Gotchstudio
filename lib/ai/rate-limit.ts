import { NextRequest } from "next/server";

/**
 * Lightweight in-memory fixed-window rate limiter, keyed by client IP + bucket.
 *
 * This is per-process: it's the right primitive for a single VPS instance (run
 * PM2 in fork mode, or one worker — see ecosystem.config.cjs). For multi-instance
 * scaling, swap the Map for Redis behind the same `checkRateLimit` signature.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

// Periodically evict stale buckets so the Map can't grow unbounded.
const SWEEP_MS = 5 * 60_000;
let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < SWEEP_MS) return;
  lastSweep = now;
  for (const [key, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(key);
  }
}

export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the window resets (for a Retry-After header). */
  retryAfter: number;
}

/**
 * @param bucket  logical endpoint name (e.g. "chat", "visualize")
 * @param limit   max requests allowed per window
 * @param windowMs window length in milliseconds
 */
export function checkRateLimit(
  req: NextRequest,
  bucket: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  sweep(now);
  const key = `${bucket}:${clientIp(req)}`;
  const entry = hits.get(key);

  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  entry.count += 1;
  if (entry.count > limit) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

/** Standard 429 response with a Retry-After header. */
export function tooManyRequests(retryAfter: number): Response {
  return new Response(
    JSON.stringify({ error: "Too many requests. Please slow down." }),
    {
      status: 429,
      headers: {
        "content-type": "application/json",
        "retry-after": String(retryAfter),
      },
    },
  );
}
