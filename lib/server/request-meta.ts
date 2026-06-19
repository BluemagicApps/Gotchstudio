import { NextRequest } from "next/server";
import crypto from "crypto";
import { clientIp } from "@/lib/ai/rate-limit";

/** Server-derived context attached to every submission for audit + attribution. */
export interface RequestMeta {
  ipHash: string | null;
  userAgent: string | null;
  referrer: string | null;
}

/**
 * Salted SHA-256 of the client IP — we never store raw IPs (privacy/GDPR). The
 * hash is stable per-IP so abuse can still be correlated, but the address itself
 * isn't recoverable. Set AUDIT_SALT to a random value in production.
 */
export function hashIp(ip: string | null): string | null {
  if (!ip || ip === "unknown") return null;
  const salt = process.env.AUDIT_SALT || "gotch-default-salt";
  return crypto
    .createHash("sha256")
    .update(`${salt}:${ip}`)
    .digest("hex")
    .slice(0, 32);
}

export function getRequestMeta(req: NextRequest): RequestMeta {
  return {
    ipHash: hashIp(clientIp(req)),
    userAgent: req.headers.get("user-agent")?.slice(0, 400) ?? null,
    referrer: req.headers.get("referer")?.slice(0, 400) ?? null,
  };
}
