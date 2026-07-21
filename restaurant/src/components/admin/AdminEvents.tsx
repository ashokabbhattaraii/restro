"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import FoodImage from "@/components/shared/FoodImage";
import DataTable from "@/components/admin/DataTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPagination from "@/components/admin/AdminPagination";
import { useEventsAdmin, useCreateEvent, useUpdateEvent, useDeleteEvent } from "@/hooks/useApi";
import { Calendar, Pencil, Trash2, Loader2, Search, ArrowUpDown, Plus, Eye, EyeOff } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import toast from "react-hot-toast";
import type { EventItem } from "@/types";
import { fetcher } from "@/lib/api/client";

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

export default function AdminEvents() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState<EventItem | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | "add" | null>(null);
  const [configEventTypes, setConfigEventTypes] = useState<string[]>([]);

  const { data: events = [] } = useEventsAdmin();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const isPending = updateEvent.isPending || deleteEvent.isPending || createEvent.isPending;

  useEffect(() => {
    fetcher<{ eventTypes: string[] }>("/api/config")
      .then((cfg) => { if (cfg.eventTypes) setConfigEventTypes(cfg.eventTypes); })
      .catch(() => {});
  }, []);

  const eventTypes = useMemo(() => {
    const types = new Set(events.map((e) => e.type).filter(Boolean));
    return ["all", ...Array.from(types)];
  }, [events]);

  const activeCount = useMemo(() => events.filter((e) => e.active !== false).length, [events]);
  const inactiveCount = events.length - activeCount;

  const debouncedSearch = useDebouncedCallback(
    useCallback((value: string) => {
      setSearch(value);
      setCurrentPage(1);
    }, []),
    300
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const result = events.filter((e) => {
      const matchSearch = !search ||
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        (e.type || "").toLowerCase().includes(q);
      const matchType = typeFilter === "all" || e.type === typeFilter;
      const matchStatus = statusFilter === "all" ||
        (statusFilter === "active" && e.active !== false) ||
        (statusFilter === "inactive" && e.active === false);
      return matchSearch && matchType && matchStatus;
    });
    result.sort((a, b) => {
      const dA = new Date(a.date).getTime();
      const dB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dB - dA : dA - dB;
    });
    return result;
  }, [events, search, typeFilter, statusFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginatedRows = useMemo(
    () => filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [filtered, currentPage, rowsPerPage]
  );

  const openModal = useCallback((row: EventItem | null, mode: typeof modalMode) => {
    setSelectedRow(row);
    setModalMode(mode);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedRow(null);
    setModalMode(null);
  }, []);

  const handleSave = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRow) return;
    const form = e.currentTarget;
    try {
      await updateEvent.mutateAsync({
        id: (selectedRow._id || selectedRow.id)!,
        title: (form.elements.namedItem("title") as HTMLInputElement).value,
        description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
        date: (form.elements.namedItem("date") as HTMLInputElement).value,
        time: (form.elements.namedItem("time") as HTMLInputElement).value,
        type: (form.elements.namedItem("type") as HTMLSelectElement).value,
        active: selectedRow.active !== false,
        image: (form.elements.namedItem("image") as HTMLInputElement).value,
      });
      toast.success("Event updated");
      closeModal();
    } catch {
      toast.error("Failed to update event");
    }
  }, [selectedRow, updateEvent, closeModal]);

  const handleCreate = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      await createEvent.mutateAsync({
        title: (form.elements.namedItem("title") as HTMLInputElement).value,
        description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
        date: (form.elements.namedItem("date") as HTMLInputElement).value,
        time: (form.elements.namedItem("time") as HTMLInputElement).value,
        type: (form.elements.namedItem("type") as HTMLSelectElement).value,
        active: true,
        image: (form.elements.namedItem("image") as HTMLInputElement).value,
      });
      toast.success("Event created");
      closeModal();
    } catch {
      toast.error("Failed to create event");
    }
  }, [createEvent, closeModal]);

  const handleDelete = useCallback(async () => {
    if (!selectedRow) return;
    try {
      await deleteEvent.mutateAsync((selectedRow._id || selectedRow.id)!);
      toast.success("Event deleted");
      closeModal();
    } catch {
      toast.error("Failed to delete event");
    }
  }, [selectedRow, deleteEvent, closeModal]);

  const toggleActive = useCallback(async (event: EventItem) => {
    const id = event._id || event.id;
    if (!id) return;
    try {
      await updateEvent.mutateAsync({ id, active: event.active === false });
      toast.success(event.active === false ? "Event activated" : "Event deactivated");
    } catch {
      toast.error("Failed to update event");
    }
  }, [updateEvent]);

  return (
    <div className="admin-page-content">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Events</h2>
          <div className="admin-panel-header-actions">
            <span className="admin-panel-badge">{events.length} events</span>
            {activeCount > 0 && (
              <span className="admin-panel-badge" style={{ background: "#059669", color: "#fff" }}>
                {activeCount} active
              </span>
            )}
            {inactiveCount > 0 && (
              <span className="admin-panel-badge" style={{ background: "#e74c3c", color: "#fff" }}>
                {inactiveCount} inactive
              </span>
            )}
            <button type="button" className="admin-btn-primary" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => openModal(null, "add")}>
              <Plus size={13} /> Add Event
            </button>
          </div>
        </div>

        <div className="admin-filters">
          <div className="admin-search-wrap">
            <Search size={15} className="admin-search-icon" />
            <input
              className="admin-input admin-search-input"
              type="text"
              placeholder="Search by title, description or type…"
              defaultValue={search}
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
          <select
            className="admin-input admin-select"
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All Types</option>
            {eventTypes.filter((t) => t !== "all").map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            className="admin-input admin-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setCurrentPage(1); }}
          >
            {STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            type="button"
            className="admin-btn-sm"
            onClick={() => setSortOrder((s) => (s === "newest" ? "oldest" : "newest"))}
          >
            <ArrowUpDown size={12} /> {sortOrder === "newest" ? "Newest" : "Oldest"}
          </button>
        </div>

        <DataTable<EventItem>
          columns={[
            {
              key: "title",
              label: "Event",
              render: (_value, row) => (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ position: "relative", width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                    <FoodImage src={row.image} alt={row.title} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: "var(--a-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {row.title}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--a-text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {row.type || "General"}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: "type",
              label: "Type",
              render: (value) => <span className="admin-badge">{String(value || "General")}</span>,
            },
            {
              key: "date",
              label: "Date",
              render: (value, row) => (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Calendar size={12} /> {String(value)}{row.time ? ` · ${row.time}` : ""}
                </span>
              ),
            },
            {
              key: "active",
              label: "Status",
              render: (value) => (
                <span className={`admin-badge ${value !== false ? "badge-success" : "badge-danger"}`}>
                  {value !== false ? "Active" : "Inactive"}
                </span>
              ),
            },
          ]}
          data={paginatedRows}
          onView={(row) => openModal(row, "view")}
          onEdit={(row) => openModal(row, "edit")}
          onDelete={(row) => openModal(row, "delete")}
        />

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalRows={filtered.length}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(rows) => { setRowsPerPage(rows); setCurrentPage(1); }}
        />
      </div>

      {/* View Modal */}
      <AdminModal open={modalMode === "view" && !!selectedRow} onClose={closeModal} title="Event Details" size="lg">
        {selectedRow && (
          <div className="admin-detail-grid">
            <div className="admin-detail-item admin-detail-item--full" style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ position: "relative", width: 120, height: 80, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                <FoodImage src={selectedRow.image} alt={selectedRow.title} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>{selectedRow.title}</p>
                <p style={{ margin: 0, color: "var(--a-text-3)" }}>{selectedRow.type || "General"}</p>
              </div>
            </div>
            <div className="admin-detail-item">
              <label>Date</label>
              <p><Calendar size={13} /> {selectedRow.date}{selectedRow.time ? ` · ${selectedRow.time}` : ""}</p>
            </div>
            <div className="admin-detail-item">
              <label>Status</label>
              <p>
                <span className={`admin-badge ${selectedRow.active !== false ? "badge-success" : "badge-danger"}`}>
                  {selectedRow.active !== false ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
            <div className="admin-detail-item admin-detail-item--full">
              <label>Description</label>
              <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{selectedRow.description}</p>
            </div>
            <div className="admin-detail-actions">
              <button type="button" className="admin-btn-primary" onClick={() => setModalMode("edit")}>
                <Pencil size={13} /> Edit Event
              </button>
              <button
                type="button"
                className="admin-btn-sm"
                onClick={() => toggleActive(selectedRow)}
                disabled={updateEvent.isPending}
              >
                {selectedRow.active !== false ? <><EyeOff size={13} /> Deactivate</> : <><Eye size={13} /> Activate</>}
              </button>
              <button
                type="button"
                className="admin-btn-sm admin-btn-sm--danger"
                onClick={() => setModalMode("delete")}
                disabled={isPending}
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Add Event Modal */}
      <AdminModal open={modalMode === "add"} onClose={closeModal} title="Add Event" size="md">
        <form className="admin-form" onSubmit={handleCreate}>
          <label>
            <span>Title</span>
            <input className="admin-input" name="title" required />
          </label>
          <label>
            <span>Description</span>
            <textarea className="admin-input admin-textarea" name="description" rows={3} required />
          </label>
          <div className="admin-form-row">
            <label>
              <span>Date</span>
              <input className="admin-input" name="date" type="date" required />
            </label>
            <label>
              <span>Time</span>
              <input className="admin-input" name="time" type="time" />
            </label>
          </div>
          <label>
            <span>Type</span>
            <select className="admin-input admin-select" name="type">
              <option value="">Select type</option>
              {configEventTypes.length > 0 && configEventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label>
            <span>Image URL</span>
            <input className="admin-input" name="image" required placeholder="https://..." />
          </label>
          <div className="admin-detail-actions">
            <button type="submit" className="admin-btn-primary" disabled={createEvent.isPending}>
              {createEvent.isPending ? <><Loader2 size={13} className="animate-spin" /> Creating…</> : "Create Event"}
            </button>
            <button type="button" className="admin-btn-sm" onClick={closeModal}>Cancel</button>
          </div>
        </form>
      </AdminModal>

      {/* Edit Event Modal */}
      <AdminModal open={modalMode === "edit" && !!selectedRow} onClose={closeModal} title="Edit Event" size="md">
        {selectedRow && (
          <form className="admin-form" onSubmit={handleSave}>
            <label>
              <span>Title</span>
              <input className="admin-input" name="title" defaultValue={selectedRow.title} required />
            </label>
            <label>
              <span>Description</span>
              <textarea className="admin-input admin-textarea" name="description" rows={3} defaultValue={selectedRow.description} required />
            </label>
            <div className="admin-form-row">
              <label>
                <span>Date</span>
                <input className="admin-input" name="date" defaultValue={selectedRow.date} required />
              </label>
              <label>
                <span>Time</span>
                <input className="admin-input" name="time" defaultValue={selectedRow.time || ""} type="time" />
              </label>
            </div>
            <label>
              <span>Type</span>
              <select className="admin-input admin-select" name="type" defaultValue={selectedRow.type || ""}>
                <option value="">Select type</option>
                {configEventTypes.length > 0 && configEventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label>
              <span>Image URL</span>
              <input className="admin-input" name="image" defaultValue={selectedRow.image} required />
            </label>
            <div className="admin-detail-actions">
              <button type="submit" className="admin-btn-primary" disabled={updateEvent.isPending}>
                {updateEvent.isPending ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : "Save Changes"}
              </button>
              <button type="button" className="admin-btn-sm" onClick={closeModal} disabled={isPending}>Cancel</button>
            </div>
          </form>
        )}
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminModal open={modalMode === "delete" && !!selectedRow} onClose={closeModal} title="Delete Event" size="sm">
        {selectedRow && (
          <div className="admin-delete-confirm">
            <div className="admin-delete-confirm-icon"><Trash2 size={20} /></div>
            <p>Delete event <strong>{selectedRow.title}</strong>?</p>
            <p className="admin-delete-confirm-hint">This action cannot be undone.</p>
            <div className="admin-detail-actions">
              <button type="button" className="admin-btn-sm admin-btn-sm--danger" disabled={deleteEvent.isPending} onClick={handleDelete}>
                {deleteEvent.isPending ? "Deleting…" : "Yes, Delete"}
              </button>
              <button type="button" className="admin-btn-sm" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
