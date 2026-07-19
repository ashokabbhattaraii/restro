"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Search, ListChecks, ShieldAlert, Filter } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import AdminPagination from "@/components/admin/AdminPagination";
import DataTable from "@/components/admin/DataTable";
import AdminModal from "@/components/admin/AdminModal";
import type { AuditLogEntry } from "@/types";

const ACTION_OPTIONS = [
  { value: "all", label: "All Actions" },
  { value: "create", label: "Create" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
  { value: "import", label: "Import" },
  { value: "bulk-update", label: "Bulk Update" },
] as const;

const RESOURCE_OPTIONS = [
  { value: "all", label: "All Resources" },
  { value: "menu", label: "Menu" },
  { value: "reservation", label: "Reservations" },
  { value: "event", label: "Events" },
  { value: "staff", label: "Staff" },
  { value: "gallery", label: "Gallery" },
  { value: "message", label: "Messages" },
] as const;

const ACTION_COLORS: Record<string, string> = {
  create: "#22c55e",
  update: "#3b82f6",
  delete: "#ef4444",
  import: "#a855f7",
  "bulk-update": "#f59e0b",
};

export default function AdminAuditLog() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);

  const fetchLog = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(rowsPerPage),
        offset: String((currentPage - 1) * rowsPerPage),
        action: actionFilter,
        resource: resourceFilter,
        search,
      });
      const res = await fetch(`/api/audit-log?${params}`);
      const json = await res.json();
      setEntries(json.data?.entries || json.entries || []);
      setTotal(json.data?.total || json.total || 0);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, actionFilter, resourceFilter, search]);

  useEffect(() => {
    fetchLog();
  }, [fetchLog]);

  const debouncedSearch = useDebouncedCallback(
    useCallback((val: string) => {
      setSearch(val);
      setCurrentPage(1);
    }, []),
    250
  );

  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));

  return (
    <div className="admin-page-content">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2><ShieldAlert size={17} /> Audit Log</h2>
          <span className="admin-panel-badge">{total} entries</span>
        </div>

        <div className="admin-filters">
          <div className="admin-search-wrap">
            <Search size={15} className="admin-search-icon" />
            <input
              className="admin-input admin-search-input"
              type="text"
              placeholder="Search by summary, admin or resource ID…"
              defaultValue={search}
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
          <select
            className="admin-input admin-select"
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1); }}
          >
            {ACTION_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            className="admin-input admin-select"
            value={resourceFilter}
            onChange={(e) => { setResourceFilter(e.target.value); setCurrentPage(1); }}
          >
            {RESOURCE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="admin-empty">Loading audit log…</p>
        ) : (
          <DataTable<AuditLogEntry>
            columns={[
              {
                key: "action",
                label: "Action",
                render: (val) => (
                  <span
                    style={{
                      color: ACTION_COLORS[val as string] || "#888",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      fontSize: 12,
                    }}
                  >
                    {val as string}
                  </span>
                ),
              },
              {
                key: "resource",
                label: "Resource",
                render: (val) => <span className="admin-badge">{val as string}</span>,
              },
              { key: "summary", label: "Summary" },
              {
                key: "admin",
                label: "Admin",
                render: (val) => <span style={{ fontWeight: 500 }}>{val as string}</span>,
              },
              {
                key: "timestamp",
                label: "Time",
                render: (val) => {
                  const d = new Date(val as string);
                  return (
                    <span style={{ fontSize: 12, color: "var(--a-text-3)" }}>
                      {d.toLocaleDateString()} {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  );
                },
              },
            ]}
            data={entries}
            onView={(row) => setSelectedEntry(row)}
          />
        )}

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalRows={total}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(rows) => { setRowsPerPage(rows); setCurrentPage(1); }}
        />
      </div>

      <AdminModal open={!!selectedEntry} onClose={() => setSelectedEntry(null)} title="Audit Log Detail" size="md">
        {selectedEntry && (
          <div className="admin-detail-grid">
            <div className="admin-detail-item">
              <label>Action</label>
              <p><span className="admin-badge">{selectedEntry.action}</span></p>
            </div>
            <div className="admin-detail-item">
              <label>Resource</label>
              <p>{selectedEntry.resource}</p>
            </div>
            <div className="admin-detail-item">
              <label>Resource ID</label>
              <p style={{ fontSize: 13, fontFamily: "monospace" }}>{selectedEntry.resourceId || "—"}</p>
            </div>
            <div className="admin-detail-item">
              <label>Admin</label>
              <p>{selectedEntry.admin}</p>
            </div>
            <div className="admin-detail-item">
              <label>Timestamp</label>
              <p>{new Date(selectedEntry.timestamp).toLocaleString()}</p>
            </div>
            <div className="admin-detail-item admin-detail-item--full">
              <label>Summary</label>
              <p>{selectedEntry.summary}</p>
            </div>
            {selectedEntry.details && (
              <div className="admin-detail-item admin-detail-item--full">
                <label>Details</label>
                <pre style={{ fontSize: 12, whiteSpace: "pre-wrap", maxHeight: 200, overflow: "auto" }}>
                  {JSON.stringify(selectedEntry.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </div>
  );
}
