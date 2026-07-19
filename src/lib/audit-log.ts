import type { AuditLogEntry, AuditAction, AuditResource } from "@/types";

const auditLog: AuditLogEntry[] = [];
const MAX_ENTRIES = 5000;

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

export function addAuditLog(entry: {
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  summary: string;
  details?: Record<string, unknown>;
  admin: string;
}): AuditLogEntry {
  const id = crypto.randomUUID();
  const logEntry: AuditLogEntry = {
    id,
    action: entry.action,
    resource: entry.resource,
    resourceId: entry.resourceId,
    summary: entry.summary,
    details: entry.details,
    timestamp: new Date().toISOString(),
    admin: entry.admin,
  };

  auditLog.unshift(logEntry);

  if (auditLog.length > MAX_ENTRIES) {
    auditLog.length = MAX_ENTRIES;
  }

  return logEntry;
}
