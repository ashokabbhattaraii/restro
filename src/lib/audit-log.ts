import type { AuditLogEntry, AuditAction, AuditResource } from "@/types";

const auditLog: AuditLogEntry[] = [];
const MAX_ENTRIES = 10000;

function getClientInfo(): { ip?: string; userAgent?: string } {
  if (typeof window !== "undefined") return {};
  try {
    const headers = new Headers();
    // In server components/API routes, we can access request headers
    return { ip: headers.get("x-forwarded-for") || undefined, userAgent: headers.get("user-agent") || undefined };
  } catch {
    return {};
  }
}

export function getAuditLog(
  limit = 200,
  offset = 0,
  filters?: { action?: string; resource?: string; search?: string }
): { entries: AuditLogEntry[]; total: number } {
  let filtered = [...auditLog];

  if (filters?.action && filters.action !== "all") {
    filtered = filtered.filter((e) => e.action === filters.action);
  }
  if (filters?.resource && filters.resource !== "all") {
    filtered = filtered.filter((e) => e.resource === filters.resource);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.summary.toLowerCase().includes(q) ||
        e.admin.toLowerCase().includes(q) ||
        e.resourceId?.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const entries = filtered.slice(offset, offset + limit);
  return { entries, total };
}

export function getAuditLogEntry(id: string): AuditLogEntry | null {
  return auditLog.find((e) => e.id === id) ?? null;
}

export function addAuditLog(entry: {
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  summary: string;
  details?: Record<string, unknown>;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  admin: string;
  ip?: string;
  userAgent?: string;
}): AuditLogEntry {
  const id = crypto.randomUUID();
  const logEntry: AuditLogEntry = {
    id,
    action: entry.action,
    resource: entry.resource,
    resourceId: entry.resourceId,
    summary: entry.summary,
    details: entry.details,
    before: entry.before,
    after: entry.after,
    timestamp: new Date().toISOString(),
    admin: entry.admin,
    ip: entry.ip,
    userAgent: entry.userAgent,
  };

  auditLog.unshift(logEntry);

  if (auditLog.length > MAX_ENTRIES) {
    auditLog.length = MAX_ENTRIES;
  }

  return logEntry;
}

export function logCreate(resource: AuditResource, resourceId: string, summary: string, admin: string, after?: Record<string, unknown>, details?: Record<string, unknown>) {
  return addAuditLog({ action: "create", resource, resourceId, summary, admin, after, details });
}

export function logUpdate(resource: AuditResource, resourceId: string, summary: string, admin: string, before: Record<string, unknown>, after: Record<string, unknown>, details?: Record<string, unknown>) {
  return addAuditLog({ action: "update", resource, resourceId, summary, admin, before, after, details });
}

export function logDelete(resource: AuditResource, resourceId: string, summary: string, admin: string, before?: Record<string, unknown>, details?: Record<string, unknown>) {
  return addAuditLog({ action: "delete", resource, resourceId, summary, admin, before, details });
}

export function logVerify(resource: AuditResource, resourceId: string, summary: string, admin: string, verified: boolean) {
  return addAuditLog({ action: verified ? "verify" : "unverify", resource, resourceId, summary, admin, after: { verified } });
}

export function logReply(resource: AuditResource, resourceId: string, summary: string, admin: string, details?: Record<string, unknown>) {
  return addAuditLog({ action: "reply", resource, resourceId, summary, admin, details });
}

export function logExport(resource: AuditResource, admin: string, details?: Record<string, unknown>) {
  return addAuditLog({ action: "export", resource, summary: `Exported ${resource} data`, admin, details });
}