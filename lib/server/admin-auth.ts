import { NextRequest } from "next/server";
import crypto from "crypto";

/**
 * Guards /api/admin/* endpoints with a bearer token (ADMIN_API_KEY).
 *
 * - If ADMIN_API_KEY is unset, admin routes are disabled (503) rather than open.
 * - Constant-time comparison avoids timing leaks.
 *
 * Returns null when authorized, or a Response to return immediately otherwise.
 */
export function requireAdmin(req: NextRequest): Response | null {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) {
    return Response.json(
      { error: "Admin API is not configured (set ADMIN_API_KEY)." },
      { status: 503 },
    );
  }

  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}
