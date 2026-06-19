import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { subscribeSchema } from "@/lib/validation/forms";
import { getRequestMeta } from "@/lib/server/request-meta";
import { recordAudit } from "@/lib/server/audit";
import { checkRateLimit, tooManyRequests } from "@/lib/ai/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Newsletter / marketing-list signup with consent capture. Idempotent. */
export async function POST(req: NextRequest) {
  const limit = checkRateLimit(req, "subscribe", 10, 60_000);
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "A valid email is required." }, { status: 400 });
  }
  const data = parsed.data;
  const email = data.email.toLowerCase().trim();
  const meta = getRequestMeta(req);

  try {
    // Upsert: new signup, or re-subscribe a previously unsubscribed address.
    const sub = await getDb().newsletterSubscriber.upsert({
      where: { email },
      update: {
        status: "subscribed",
        consentAt: new Date(),
        locale: data.locale ?? undefined,
      },
      create: {
        email,
        locale: data.locale ?? "en",
        source: data.source ?? "newsletter",
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
      },
    });
    await recordAudit({
      action: "subscriber.create",
      entity: "subscriber",
      entityId: sub.id,
      metadata: { source: data.source },
      ipHash: meta.ipHash,
      userAgent: meta.userAgent,
    });
    return Response.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[/api/subscribe]", err);
    await recordAudit({
      action: "subscriber.create",
      entity: "subscriber",
      status: "error",
      message: String(err),
      ipHash: meta.ipHash,
    });
    return Response.json({ error: "Could not subscribe." }, { status: 500 });
  }
}
