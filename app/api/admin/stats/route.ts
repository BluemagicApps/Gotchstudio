import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/server/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * At-a-glance operational summary for auditing / a lightweight dashboard.
 *   GET /api/admin/stats   (Authorization: Bearer <ADMIN_API_KEY>)
 */
export async function GET(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const db = getDb();
  const since = (days: number) =>
    new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [
    inquiriesTotal,
    inquiriesByStatus,
    subscribersTotal,
    subscribersByStatus,
    consultationsTotal,
    consultationsByStatus,
    auditTotal,
    inquiries7d,
    consultations7d,
    subscribers7d,
  ] = await Promise.all([
    db.inquiry.count(),
    db.inquiry.groupBy({ by: ["status"], _count: true }),
    db.newsletterSubscriber.count(),
    db.newsletterSubscriber.groupBy({ by: ["status"], _count: true }),
    db.consultation.count(),
    db.consultation.groupBy({ by: ["status"], _count: true }),
    db.auditLog.count(),
    db.inquiry.count({ where: { createdAt: { gte: since(7) } } }),
    db.consultation.count({ where: { createdAt: { gte: since(7) } } }),
    db.newsletterSubscriber.count({ where: { createdAt: { gte: since(7) } } }),
  ]);

  const tally = (
    rows: { status: string; _count: number }[],
  ): Record<string, number> =>
    Object.fromEntries(rows.map((r) => [r.status, r._count]));

  return Response.json({
    generatedAt: new Date().toISOString(),
    inquiries: { total: inquiriesTotal, last7Days: inquiries7d, byStatus: tally(inquiriesByStatus) },
    subscribers: { total: subscribersTotal, last7Days: subscribers7d, byStatus: tally(subscribersByStatus) },
    consultations: { total: consultationsTotal, last7Days: consultations7d, byStatus: tally(consultationsByStatus) },
    auditEvents: auditTotal,
  });
}
