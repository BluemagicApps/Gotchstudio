import { getDb } from "@/lib/db";

export interface AuditEntry {
  action: string;
  entity: "inquiry" | "subscriber" | "consultation" | "admin";
  entityId?: string | null;
  status?: "ok" | "error" | "duplicate" | "conflict";
  message?: string;
  metadata?: Record<string, unknown>;
  actor?: "public" | "admin";
  ipHash?: string | null;
  userAgent?: string | null;
}

/**
 * Append a row to the audit trail. Best-effort: a failure here is logged but
 * never propagated, so auditing can't break the operation it's recording.
 */
export async function recordAudit(entry: AuditEntry): Promise<void> {
  try {
    await getDb().auditLog.create({
      data: {
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId ?? null,
        status: entry.status ?? "ok",
        message: entry.message,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
        actor: entry.actor ?? "public",
        ipHash: entry.ipHash ?? null,
        userAgent: entry.userAgent ?? null,
      },
    });
  } catch (err) {
    console.error("[audit] failed to record", entry.action, err);
  }
}
