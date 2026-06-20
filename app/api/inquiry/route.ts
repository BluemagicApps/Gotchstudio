import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { inquirySchema } from "@/lib/validation/forms";
import { getRequestMeta } from "@/lib/server/request-meta";
import { recordAudit } from "@/lib/server/audit";
import { checkRateLimit, tooManyRequests } from "@/lib/ai/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Project inquiry from the contact form. */
export async function POST(req: NextRequest) {
  const limit = checkRateLimit(req, "inquiry", 5, 60_000);
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;
  const meta = getRequestMeta(req);

  try {
    const inquiry = await getDb().inquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        type: data.type,
        budget: data.budget,
        message: data.message,
        source: data.source ?? "contact-page",
        locale: data.locale ?? "en",
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        referrer: meta.referrer,
        ipHash: meta.ipHash,
        userAgent: meta.userAgent,
      },
    });
    await recordAudit({
      action: "inquiry.create",
      entity: "inquiry",
      entityId: inquiry.id,
      metadata: { type: data.type, budget: data.budget, source: data.source },
      ipHash: meta.ipHash,
      userAgent: meta.userAgent,
    });
    return Response.json({ ok: true, id: inquiry.id }, { status: 201 });
  } catch (err) {
    console.error("[/api/inquiry]", err);
    await recordAudit({
      action: "inquiry.create",
      entity: "inquiry",
      status: "error",
      message: String(err),
      ipHash: meta.ipHash,
    });
    return Response.json({ error: "Could not save your inquiry." }, { status: 500 });
  }
}
