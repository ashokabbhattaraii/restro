"use client";

import { useState, useMemo, useCallback } from "react";
import DataTable from "@/components/admin/DataTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPagination from "@/components/admin/AdminPagination";
import { useAuditLog } from "@/queries/audit-log";
import { Search, Clock, User, Globe, AlertTriangle, Copy, Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import toast from "react-hot-toast";
import type { AuditLogEntry } from "@/types";

const ACTION_COLORS: Record<string, string> = {
  create: "#059669",
  update: "#2563eb",
  delete: "#dc2626",
  verify: "#16a34a",
  unverify: "#f59e0b",
  reply: "#7c3aed",
  import: "#0891b2",
  "bulk-update": "#ea580c",
  export: "#6b7280",
  login: "#0d9488",
  view: "#6366f1",
};

const ACTION_LABELS: Record<string, string> = {
  create: "Created",
  update: "Updated",
  delete: "Deleted",
  verify: "Verified",
  unverify: "Unverified",
  reply: "Replied",
  import: "Imported",
  "bulk-update": "Bulk Updated",
  export: "Exported",
  login: "Logged In",
  view: "Viewed",
};

const RESOURCE_LABELS: Record<string, string> = {
  menu: "Menu",
  reservation: "Reservations",
  event: "Events",
  staff: "Staff",
  gallery: "Gallery",
  message: "Messages",
  offer: "Offers",
  config: "Settings",
  audit: "Audit Log",
};

const ACTION_OPTIONS = [
  { value: "all", label: "All Actions" },
  ...Object.entries(ACTION_LABELS).map(([value, label]) => ({ value, label })),
];

const RESOURCE_OPTIONS = [
  { value: "all", label: "All Resources" },
  ...Object.entries(RESOURCE_LABELS).map(([value, label]) => ({ value, label })),
];

export default function AdminAuditLog() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: auditData, isLoading } = useAuditLog({
    search,
    action: actionFilter === "all" ? undefined : actionFilter,
    resource: resourceFilter === "all" ? undefined : resourceFilter,
    limit: rowsPerPage,
    offset: (currentPage - 1) * rowsPerPage,
  });

  const entries = auditData?.entries ?? [];
  const total = auditData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));

  const debouncedSearch = useDebouncedCallback(
    useCallback((val: string) => { setSearch(val); setCurrentPage(1); }, []),
    250
  );

  const handleView = useCallback((entry: AuditLogEntry) => {
    setSelectedEntry(entry);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedEntry(null);
    setModalOpen(false);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  if (isLoading) {
    return (
      <div className="admin-page-content">
        <div className="admin-panel" style={{ textAlign: "center", padding: 48 }}>
          <Loader2 size={24} className="animate-spin" style={{ color: "var(--primary)" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-content">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Audit Log</h2>
          <div className="admin-panel-header-actions">
            <span className="admin-panel-badge">{total} entries</span>
          </div>
        </div>

        <div className="admin-filters">
          <div className="admin-search-wrap">
            <Search size={15} className="admin-search-icon" />
            <input
              className="admin-input admin-search-input"
              type="text"
              placeholder="Search summary, admin, resource ID…"
              defaultValue={search}
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
          <select
            className="admin-input admin-select"
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1); }}
          >
            {ACTION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            className="admin-input admin-select"
            value={resourceFilter}
            onChange={(e) => { setResourceFilter(e.target.value); setCurrentPage(1); }}
          >
            {RESOURCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <DataTable<AuditLogEntry>
          columns={[
            {
              key: "action",
              label: "Action",
              render: (value, row) => {
                const color = ACTION_COLORS[String(value)] || "#6b7280";
                const label = ACTION_LABELS[String(value)] || String(value);
                return (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: `${color}18`, color, padding: "2px 10px",
                    borderRadius: 4, fontSize: 12, fontWeight: 600,
                  }}>
                    {label}
                  </span>
                );
              },
            },
            {
              key: "resource",
              label: "Resource",
              render: (value) => (
                <span className="admin-badge">{RESOURCE_LABELS[String(value)] || String(value)}</span>
              ),
            },
            {
              key: "summary",
              label: "Summary",
              render: (value) => (
                <span style={{ color: "var(--a-text)", maxWidth: 240, display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {String(value)}
                </span>
              ),
            },
            {
              key: "admin",
              label: "Admin",
              render: (value) => (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--a-text-2)" }}>
                  <User size={12} /> {String(value)}
                </span>
              ),
            },
            {
              key: "timestamp",
              label: "Time",
              render: (value) => (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--a-text-3)", fontSize: 12, whiteSpace: "nowrap" }}>
                  <Clock size={12} /> {formatDate(String(value))}
                </span>
              ),
            },
          ]}
          data={entries}
          onView={handleView}
        />

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalRows={total}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(rows) => { setRowsPerPage(rows); setCurrentPage(1); }}
        />
      </div>

      <AdminModal open={modalOpen && !!selectedEntry} onClose={closeModal} title="Audit Entry Details" size="lg">
        {selectedEntry && <AuditDetailContent entry={selectedEntry} onCopy={copyToClipboard} />}
      </AdminModal>
    </div>
  );
}

function AuditDetailContent({ entry, onCopy }: { entry: AuditLogEntry; onCopy: (text: string) => void }) {
  const actionColor = ACTION_COLORS[entry.action] || "#6b7280";
  const actionLabel = ACTION_LABELS[entry.action] || entry.action;

  return (
    <div className="admin-detail-grid">
      <div className="admin-detail-item admin-detail-item--full">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{
            background: `${actionColor}18`, color: actionColor,
            padding: "3px 10px", borderRadius: 4, fontSize: 12, fontWeight: 600,
          }}>
            {actionLabel}
          </span>
          <span className="admin-badge">{RESOURCE_LABELS[entry.resource] || entry.resource}</span>
        </div>
        <p style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>{entry.summary}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, color: "var(--a-text-3)", fontSize: 12 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <User size={12} /> {entry.admin}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Clock size={12} /> {new Date(entry.timestamp).toLocaleString()}
          </span>
          {entry.ip && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Globe size={12} /> {entry.ip}
            </span>
          )}
          {entry.resourceId && (
            <span style={{ fontFamily: "monospace", fontSize: 11 }}>ID: {entry.resourceId}</span>
          )}
        </div>
      </div>

      <div className="admin-detail-item admin-detail-item--full">
        <label>Summary</label>
        <p style={{ color: "var(--a-text-2)", lineHeight: 1.6 }}>{entry.summary}</p>
      </div>

      {entry.details && Object.keys(entry.details).length > 0 && (
        <div className="admin-detail-item admin-detail-item--full">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label>Details</label>
            <button type="button" className="admin-btn-sm" onClick={() => onCopy(JSON.stringify(entry.details, null, 2))}>
              <Copy size={12} /> Copy JSON
            </button>
          </div>
          <pre style={{ background: "var(--a-surface-2)", border: "1px solid var(--a-border)", borderRadius: 8, padding: 16, overflow: "auto", fontSize: 12, lineHeight: 1.5, maxHeight: 240, margin: 0 }}>
            {JSON.stringify(entry.details, null, 2)}
          </pre>
        </div>
      )}

      {entry.before && Object.keys(entry.before).length > 0 && (
        <div className="admin-detail-item admin-detail-item--full">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, color: "#f59e0b" }}>
              <AlertTriangle size={14} /> Before (Previous State)
            </label>
            <button type="button" className="admin-btn-sm" onClick={() => onCopy(JSON.stringify(entry.before, null, 2))}>
              <Copy size={12} /> Copy JSON
            </button>
          </div>
          <pre style={{ background: "var(--a-surface-2)", border: "1px solid var(--a-border)", borderRadius: 8, padding: 16, overflow: "auto", fontSize: 12, lineHeight: 1.5, maxHeight: 240, margin: 0, borderLeft: "3px solid #f59e0b" }}>
            {JSON.stringify(entry.before, null, 2)}
          </pre>
        </div>
      )}

      {entry.after && Object.keys(entry.after).length > 0 && (
        <div className="admin-detail-item admin-detail-item--full">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, color: "#059669" }}>
              <span style={{ color: "#059669" }}>●</span> After (New State)
            </label>
            <button type="button" className="admin-btn-sm" onClick={() => onCopy(JSON.stringify(entry.after, null, 2))}>
              <Copy size={12} /> Copy JSON
            </button>
          </div>
          <pre style={{ background: "var(--a-surface-2)", border: "1px solid var(--a-border)", borderRadius: 8, padding: 16, overflow: "auto", fontSize: 12, lineHeight: 1.5, maxHeight: 240, margin: 0, borderLeft: "3px solid #059669" }}>
            {JSON.stringify(entry.after, null, 2)}
          </pre>
        </div>
      )}

      {entry.userAgent && (
        <div className="admin-detail-item admin-detail-item--full">
          <label>User Agent</label>
          <code style={{ fontSize: 11, color: "var(--a-text-3)", wordBreak: "break-all", display: "block", background: "var(--a-surface-2)", padding: 12, borderRadius: 6, border: "1px solid var(--a-border)" }}>
            {entry.userAgent}
          </code>
        </div>
      )}
    </div>
  );
}