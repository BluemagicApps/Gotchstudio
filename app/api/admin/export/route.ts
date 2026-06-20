import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/server/admin-auth";
import { recordAudit } from "@/lib/server/audit";
import { toCsv, type CsvColumn } from "@/lib/export/csv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ExportType = "inquiries" | "subscribers" | "consultations" | "audit";

// Column maps drive both the CSV header order and which fields are exported.
const COLUMNS: Record<ExportType, CsvColumn[]> = {
  inquiries: [
    { key: "createdAt", header: "Created" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "location", header: "Location" },
    { key: "type", header: "Project Type" },
    { key: "budget", header: "Budget" },
    { key: "message", header: "Message" },
    { key: "status", header: "Status" },
    { key: "source", header: "Source" },
    { key: "locale", header: "Locale" },
    { key: "utmSource", header: "UTM Source" },
    { key: "utmMedium", header: "UTM Medium" },
    { key: "utmCampaign", header: "UTM Campaign" },
  ],
  subscribers: [
    { key: "createdAt", header: "Created" },
    { key: "email", header: "Email" },
    { key: "status", header: "Status" },
    { key: "locale", header: "Locale" },
    { key: "consentAt", header: "Consent At" },
    { key: "source", header: "Source" },
    { key: "utmSource", header: "UTM Source" },
    { key: "utmMedium", header: "UTM Medium" },
    { key: "utmCampaign", header: "UTM Campaign" },
  ],
  consultations: [
    { key: "createdAt", header: "Created" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "service", header: "Service" },
    { key: "date", header: "Date" },
    { key: "slot", header: "Slot" },
    { key: "mode", header: "Mode" },
    { key: "status", header: "Status" },
    { key: "source", header: "Source" },
  ],
  audit: [
    { key: "createdAt", header: "Created" },
    { key: "action", header: "Action" },
    { key: "entity", header: "Entity" },
    { key: "entityId", header: "Entity ID" },
    { key: "status", header: "Status" },
    { key: "actor", header: "Actor" },
    { key: "message", header: "Message" },
    { key: "metadata", header: "Metadata" },
  ],
};

/**
 * Audit + marketing export.
 *   GET /api/admin/export?type=subscribers&format=csv&from=2026-01-01&to=2026-12-31&status=subscribed
 * Auth: Authorization: Bearer <ADMIN_API_KEY>
 */
export async function GET(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const type = (searchParams.get("type") || "inquiries") as ExportType;
  if (!COLUMNS[type]) {
    return Response.json(
      { error: "type must be inquiries | subscribers | consultations | audit" },
      { status: 400 },
    );
  }
  const format = searchParams.get("format") === "json" ? "json" : "csv";
  const status = searchParams.get("status") || undefined;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // Build a date-range filter on createdAt (and status, where supported).
  const where: Record<string, unknown> = {};
  if (from || to) {
    where.createdAt = {
      ...(from ? { gte: new Date(`${from}T00:00:00.000Z`) } : {}),
      ...(to ? { lte: new Date(`${to}T23:59:59.999Z`) } : {}),
    };
  }
  if (status && type !== "audit") where.status = status;

  const db = getDb();
  const rows = (await (
    {
      inquiries: () => db.inquiry.findMany({ where, orderBy: { createdAt: "desc" } }),
      subscribers: () =>
        db.newsletterSubscriber.findMany({ where, orderBy: { createdAt: "desc" } }),
      consultations: () =>
        db.consultation.findMany({ where, orderBy: { date: "desc" } }),
      audit: () => db.auditLog.findMany({ where, orderBy: { createdAt: "desc" }, take: 10000 }),
    }[type]
  )()) as Record<string, unknown>[];

  await recordAudit({
    action: "admin.export",
    entity: "admin",
    actor: "admin",
    metadata: { type, format, count: rows.length, from, to, status },
  });

  const stamp = new Date().toISOString().slice(0, 10);
  if (format === "json") {
    return new Response(JSON.stringify({ type, count: rows.length, rows }, null, 2), {
      headers: {
        "content-type": "application/json",
        "content-disposition": `attachment; filename="gotch-${type}-${stamp}.json"`,
      },
    });
  }
  return new Response(toCsv(rows, COLUMNS[type]), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="gotch-${type}-${stamp}.csv"`,
    },
  });
}
