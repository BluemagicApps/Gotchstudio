import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { getDb } from "@/lib/db";
import { consultationSchema } from "@/lib/validation/forms";
import { getRequestMeta } from "@/lib/server/request-meta";
import { recordAudit } from "@/lib/server/audit";
import { checkRateLimit, tooManyRequests } from "@/lib/ai/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Consultation / appointment booking. Enforces one booking per date+slot. */
export async function POST(req: NextRequest) {
  const limit = checkRateLimit(req, "consultation", 6, 60_000);
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = consultationSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;
  const meta = getRequestMeta(req);
  // Normalize the chosen day to a stable UTC midnight so (date, slot) is unique.
  const date = new Date(`${data.date}T00:00:00.000Z`);

  try {
    const booking = await getDb().consultation.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        date,
        slot: data.slot,
        mode: data.mode ?? "virtual",
        notes: data.notes,
        source: data.source ?? "booking-widget",
        locale: data.locale ?? "en",
        ipHash: meta.ipHash,
        userAgent: meta.userAgent,
      },
    });
    await recordAudit({
      action: "consultation.create",
      entity: "consultation",
      entityId: booking.id,
      metadata: { service: data.service, date: data.date, slot: data.slot },
      ipHash: meta.ipHash,
      userAgent: meta.userAgent,
    });
    return Response.json({ ok: true, id: booking.id }, { status: 201 });
  } catch (err) {
    // P2002 = unique constraint (date + slot already booked).
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      await recordAudit({
        action: "consultation.create",
        entity: "consultation",
        status: "conflict",
        message: `slot taken: ${data.date} ${data.slot}`,
        ipHash: meta.ipHash,
      });
      return Response.json(
        { error: "That time was just booked. Please choose another slot." },
        { status: 409 },
      );
    }
    console.error("[/api/consultation]", err);
    await recordAudit({
      action: "consultation.create",
      entity: "consultation",
      status: "error",
      message: String(err),
      ipHash: meta.ipHash,
    });
    return Response.json({ error: "Could not request your booking." }, { status: 500 });
  }
}
