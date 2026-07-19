"use client";

import { useState, useMemo, useCallback } from "react";
import FoodImage from "@/components/shared/FoodImage";
import AdminModal from "@/components/admin/AdminModal";
import AdminPagination from "@/components/admin/AdminPagination";
import { useEventsAdmin, useCreateEvent, useUpdateEvent, useDeleteEvent } from "@/hooks/useApi";
import { Calendar, Pencil, Trash2, Loader2, Search, ArrowUpDown, Plus } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import toast from "react-hot-toast";
import type { EventItem } from "@/types";

export default function AdminEvents() {
  const [addMode, setAddMode] = useState(false);
  const [editEvent, setEditEvent] = useState<EventItem | null>(null);
  const [deleteEventItem, setDeleteEventItem] = useState<EventItem | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const { data: events = [] } = useEventsAdmin();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const isPending = updateEvent.isPending || deleteEvent.isPending;

  const eventTypes = useMemo(() => {
    const types = new Set(events.map((e) => e.type).filter(Boolean));
    return ["all", ...Array.from(types)];
  }, [events]);

  const debouncedSearch = useDebouncedCallback(
    useCallback((val: string) => {
      setSearch(val);
      setCurrentPage(1);
    }, []),
    250
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = events.filter((e) => {
      const matchSearch = !search ||
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        (e.type || "").toLowerCase().includes(q);
      const matchType = typeFilter === "all" || e.type === typeFilter;
      return matchSearch && matchType;
    });
    result.sort((a, b) => {
      const dA = new Date(a.date).getTime();
      const dB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dB - dA : dA - dB;
    });
    return result;
  }, [events, search, typeFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginatedEvents = useMemo(
    () => filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [filtered, currentPage, rowsPerPage]
  );

  const handleSave = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editEvent) return;
    const form = e.currentTarget;
    try {
      await updateEvent.mutateAsync({
        id: (editEvent._id || editEvent.id)!,
        title: (form.elements.namedItem("title") as HTMLInputElement).value,
        description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
        date: (form.elements.namedItem("date") as HTMLInputElement).value,
        time: (form.elements.namedItem("time") as HTMLInputElement).value,
        type: (form.elements.namedItem("type") as HTMLInputElement).value,
        image: (form.elements.namedItem("image") as HTMLInputElement).value,
      });
      toast.success("Event updated");
      setEditEvent(null);
    } catch {
      toast.error("Failed to update event");
    }
  }, [editEvent, updateEvent]);

  const handleCreate = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      await createEvent.mutateAsync({
        title: (form.elements.namedItem("title") as HTMLInputElement).value,
        description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
        date: (form.elements.namedItem("date") as HTMLInputElement).value,
        time: (form.elements.namedItem("time") as HTMLInputElement).value,
        type: (form.elements.namedItem("type") as HTMLInputElement).value,
        image: (form.elements.namedItem("image") as HTMLInputElement).value,
      });
      toast.success("Event created");
      setAddMode(false);
    } catch {
      toast.error("Failed to create event");
    }
  }, [createEvent]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteEventItem) return;
    try {
      await deleteEvent.mutateAsync((deleteEventItem._id || deleteEventItem.id)!);
      toast.success("Event deleted");
      setDeleteEventItem(null);
    } catch {
      toast.error("Failed to delete event");
    }
  }, [deleteEventItem, deleteEvent]);

  return (
    <div className="admin-page-content">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Events</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="admin-panel-badge">{events.length} events</span>
            <button type="button" className="admin-btn-primary" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => setAddMode(true)}>
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
            {eventTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
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

        <div className="admin-event-grid">
          {paginatedEvents.length === 0 ? (
            <p className="admin-empty">No events match your search.</p>
          ) : (
            paginatedEvents.map((event) => (
              <div
                className="admin-event-card"
                key={event._id || event.id}
                role="button"
                tabIndex={0}
                onClick={() => setEditEvent(event)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setEditEvent(event); }}
              >
                <div className="admin-event-card-img">
                  <FoodImage src={event.image} alt={event.title} />
                </div>
                <div className="admin-event-card-body">
                  <span className="admin-badge">{event.type || "General"}</span>
                  <h3>{event.title}</h3>
                  <p><Calendar size={12} /> {event.date}{event.time ? ` · ${event.time}` : ""}</p>
                  <div className="admin-event-card-actions">
                    <button type="button" className="admin-btn-sm" onClick={(e) => { e.stopPropagation(); setEditEvent(event); }} disabled={isPending}>
                      <Pencil size={12} /> Edit
                    </button>
                    <button type="button" className="admin-btn-sm admin-btn-sm--danger" onClick={(e) => { e.stopPropagation(); setDeleteEventItem(event); }} disabled={isPending}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalRows={filtered.length}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(rows) => { setRowsPerPage(rows); setCurrentPage(1); }}
        />
      </div>

      {/* Add Event Modal */}
      <AdminModal open={addMode} onClose={() => setAddMode(false)} title="Add Event" size="md">
        <form className="admin-form" onSubmit={handleCreate}>
          <label>
            <span>Title</span>
            <input className="admin-input" name="title" required />
          </label>
          <label>
            <span>Description</span>
            <textarea className="admin-input admin-textarea" name="description" rows={3} />
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
            <input className="admin-input" name="type" placeholder="e.g. Live Music, Festival" />
          </label>
          <label>
            <span>Image URL</span>
            <input className="admin-input" name="image" required />
          </label>
          <div className="admin-detail-actions">
            <button type="submit" className="admin-btn-primary" disabled={createEvent.isPending}>
              {createEvent.isPending ? <><Loader2 size={13} className="animate-spin" /> Creating…</> : "Create Event"}
            </button>
            <button type="button" className="admin-btn-sm" onClick={() => setAddMode(false)}>Cancel</button>
          </div>
        </form>
      </AdminModal>

      <AdminModal open={!!editEvent} onClose={() => setEditEvent(null)} title="Edit Event" size="md">
        {editEvent && (
          <form className="admin-form" onSubmit={handleSave}>
            <label>
              <span>Title</span>
              <input className="admin-input" name="title" defaultValue={editEvent.title} required />
            </label>
            <label>
              <span>Description</span>
              <textarea className="admin-input admin-textarea" name="description" rows={3} defaultValue={editEvent.description} />
            </label>
            <label>
              <span>Date</span>
              <input className="admin-input" name="date" defaultValue={editEvent.date} required />
            </label>
            <label>
              <span>Time</span>
              <input className="admin-input" name="time" defaultValue={editEvent.time || ""} />
            </label>
            <label>
              <span>Type</span>
              <input className="admin-input" name="type" defaultValue={editEvent.type || ""} />
            </label>
            <label>
              <span>Image URL</span>
              <input className="admin-input" name="image" defaultValue={editEvent.image} required />
            </label>
            <div className="admin-detail-actions">
              <button type="submit" className="admin-btn-primary" disabled={updateEvent.isPending}>
                {updateEvent.isPending ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : "Save Changes"}
              </button>
              <button type="button" className="admin-btn-sm" onClick={() => setEditEvent(null)} disabled={isPending}>Cancel</button>
            </div>
          </form>
        )}
      </AdminModal>

      <AdminModal open={!!deleteEventItem} onClose={() => setDeleteEventItem(null)} title="Delete Event" size="sm">
        {deleteEventItem && (
          <div className="admin-delete-confirm">
            <div className="admin-delete-confirm-icon"><Trash2 size={20} /></div>
            <p>Delete event <strong>{deleteEventItem.title}</strong>?</p>
            <p className="admin-delete-confirm-hint">This action cannot be undone.</p>
            <div className="admin-detail-actions">
              <button type="button" className="admin-btn-sm admin-btn-sm--danger" disabled={deleteEvent.isPending} onClick={handleDeleteConfirm}>
                {deleteEvent.isPending ? "Deleting…" : "Yes, Delete"}
              </button>
              <button type="button" className="admin-btn-sm" onClick={() => setDeleteEventItem(null)}>Cancel</button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
