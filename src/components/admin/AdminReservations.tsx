"use client";

import { useState, useMemo, useCallback } from "react";
import { Download, Search, Phone, Mail, Calendar, Users, MessageSquare, FileText, CheckCircle2, PhoneCall, RotateCcw, XCircle, Trash2, Plus, Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import toast from "react-hot-toast";
import DataTable from "@/components/admin/DataTable";
import AdminModal from "@/components/admin/AdminModal";
import AdminPagination from "@/components/admin/AdminPagination";
import { useReservations, useCreateReservation, useUpdateReservation, useDeleteReservation } from "@/hooks/useApi";
import type { Reservation } from "@/types";

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "contacted", label: "Contacted" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

function exportToCSV(rows: Reservation[]) {
  const headers: (keyof Reservation)[] = ["name", "phone", "email", "date", "time", "guests", "occasion", "remarks", "status"];
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reservations-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

type ModalMode = "view" | "edit" | "delete" | "add" | null;

export default function AdminReservations() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedRow, setSelectedRow] = useState<Reservation | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [remarks, setRemarks] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: reservations = [] } = useReservations();
  const createReservation = useCreateReservation();
  const updateReservation = useUpdateReservation();
  const deleteReservation = useDeleteReservation();

  const isPending = updateReservation.isPending || deleteReservation.isPending;

  const debouncedSearch = useDebouncedCallback(
    useCallback((value: string) => {
      setSearch(value);
      setCurrentPage(1);
    }, []),
    300
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return reservations.filter((r) => {
      const matchSearch = !search ||
        r.name.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        (r.email || "").toLowerCase().includes(q);
      const matchStatus = status === "all" || r.status.toLowerCase() === status;
      return matchSearch && matchStatus;
    });
  }, [reservations, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginatedRows = useMemo(
    () => filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [filtered, currentPage, rowsPerPage]
  );

  const openModal = useCallback((row: Reservation, mode: ModalMode) => {
    setSelectedRow(row);
    setModalMode(mode);
    setRemarks(row.remarks || "");
  }, []);

  const closeModal = useCallback(() => {
    setSelectedRow(null);
    setModalMode(null);
    setRemarks("");
  }, []);

  const updateStatus = useCallback(async (newStatus: Reservation["status"]) => {
    if (!selectedRow) return;
    try {
      await updateReservation.mutateAsync({
        id: (selectedRow._id || selectedRow.id)!,
        status: newStatus,
        remarks,
      });
      toast.success(`Reservation ${newStatus.toLowerCase()}`);
      closeModal();
    } catch {
      toast.error("Failed to update reservation");
    }
  }, [selectedRow, remarks, updateReservation, closeModal]);

  const handleEditSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRow) return;
    const form = e.currentTarget;
    try {
      await updateReservation.mutateAsync({
        id: (selectedRow._id || selectedRow.id)!,
        name: (form.elements.namedItem("name") as HTMLInputElement).value,
        date: (form.elements.namedItem("date") as HTMLInputElement).value,
        time: (form.elements.namedItem("time") as HTMLInputElement).value,
        guests: Number((form.elements.namedItem("guests") as HTMLInputElement).value),
        status: (form.elements.namedItem("status") as HTMLSelectElement).value as Reservation["status"],
        remarks: (form.elements.namedItem("remarks") as HTMLTextAreaElement).value,
      });
      toast.success("Reservation updated");
      closeModal();
    } catch {
      toast.error("Failed to update reservation");
    }
  }, [selectedRow, updateReservation, closeModal]);

  const handleCreateReservation = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    try {
      await createReservation.mutateAsync({
        name: (form.elements.namedItem("name") as HTMLInputElement).value,
        phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
        email: (form.elements.namedItem("email") as HTMLInputElement).value,
        date: (form.elements.namedItem("date") as HTMLInputElement).value,
        time: (form.elements.namedItem("time") as HTMLInputElement).value,
        guests: Number((form.elements.namedItem("guests") as HTMLInputElement).value),
        requests: (form.elements.namedItem("requests") as HTMLTextAreaElement).value,
        status: "Pending",
      });
      toast.success("Reservation created");
      closeModal();
    } catch {
      toast.error("Failed to create reservation");
    }
  }, [createReservation, closeModal]);

  const handleDelete = useCallback(async () => {
    if (!selectedRow) return;
    try {
      await deleteReservation.mutateAsync((selectedRow._id || selectedRow.id)!);
      toast.success("Reservation deleted");
      closeModal();
    } catch {
      toast.error("Failed to delete reservation");
    }
  }, [selectedRow, deleteReservation, closeModal]);

  return (
    <div className="admin-page-content">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>All Reservations</h2>
          <div className="admin-panel-header-actions">
            <span className="admin-panel-badge">{filtered.length} found</span>
            <button type="button" className="admin-btn-primary" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => { setSelectedRow(null); setModalMode("add"); }}>
              <Plus size={13} /> Add
            </button>
            <button type="button" className="admin-btn-sm" onClick={() => exportToCSV(filtered)}>
              <Download size={13} /> CSV
            </button>
          </div>
        </div>

        <div className="admin-filters">
          <div className="admin-search-wrap">
            <Search size={15} className="admin-search-icon" />
            <input
              className="admin-input admin-search-input"
              type="text"
              placeholder="Search by name, phone or email..."
              defaultValue={search}
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
          <select
            className="admin-input admin-select"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }}
          >
            {STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <DataTable<Reservation>
          columns={[
            { key: "name", label: "Guest" },
            { key: "date", label: "Date" },
            { key: "time", label: "Time" },
            { key: "guests", label: "Guests" },
            { key: "status", label: "Status" },
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

      {/* Add Reservation Modal */}
      <AdminModal open={modalMode === "add"} onClose={closeModal} title="Add Reservation" size="md">
        <form className="admin-form" onSubmit={handleCreateReservation}>
          <div className="admin-form-row">
            <label>
              <span>Guest Name</span>
              <input className="admin-input" name="name" required />
            </label>
            <label>
              <span>Phone</span>
              <input className="admin-input" name="phone" required />
            </label>
          </div>
          <label>
            <span>Email</span>
            <input className="admin-input" name="email" type="email" />
          </label>
          <div className="admin-form-row">
            <label>
              <span>Date</span>
              <input className="admin-input" name="date" type="date" required />
            </label>
            <label>
              <span>Time</span>
              <input className="admin-input" name="time" type="time" required />
            </label>
          </div>
          <label>
            <span>Guests</span>
            <input className="admin-input" name="guests" type="number" min={1} max={30} defaultValue={2} required />
          </label>
          <label>
            <span>Special Requests</span>
            <textarea className="admin-input admin-textarea" name="requests" rows={2} />
          </label>
          <div className="admin-detail-actions">
            <button type="submit" className="admin-btn-primary" disabled={createReservation.isPending}>
              {createReservation.isPending ? <><Loader2 size={13} className="animate-spin" /> Creating…</> : "Create Reservation"}
            </button>
            <button type="button" className="admin-btn-sm" onClick={closeModal}>Cancel</button>
          </div>
        </form>
      </AdminModal>

      {/* View Modal */}
      <AdminModal open={modalMode === "view"} onClose={closeModal} title="Reservation Details" size="lg">
        {selectedRow && (
          <div className="admin-detail-grid">
            <div className="admin-detail-item">
              <label><Users size={13} /> Guest Name</label>
              <p>{selectedRow.name}</p>
            </div>
            <div className="admin-detail-item">
              <label><Phone size={13} /> Phone</label>
              <p>{selectedRow.phone || "—"}</p>
            </div>
            <div className="admin-detail-item">
              <label><Mail size={13} /> Email</label>
              <p>{selectedRow.email || "—"}</p>
            </div>
            <div className="admin-detail-item">
              <label><Calendar size={13} /> Date</label>
              <p>{selectedRow.date}</p>
            </div>
            <div className="admin-detail-item">
              <label><Calendar size={13} /> Time</label>
              <p>{selectedRow.time}</p>
            </div>
            <div className="admin-detail-item">
              <label><Users size={13} /> Party Size</label>
              <p>{selectedRow.guests} guests</p>
            </div>
            <div className="admin-detail-item">
              <label>Occasion</label>
              <p>{selectedRow.occasion || "—"}</p>
            </div>
            <div className="admin-detail-item">
              <label>Status</label>
              <p>{selectedRow.status}</p>
            </div>
            <div className="admin-detail-item admin-detail-item--full">
              <label><MessageSquare size={13} /> Requests</label>
              <p>{selectedRow.requests || "—"}</p>
            </div>
            <div className="admin-detail-item admin-detail-item--full">
              <label><FileText size={13} /> Remarks</label>
              <textarea
                className="admin-input admin-textarea"
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Internal notes..."
              />
            </div>
            <div className="admin-detail-actions">
              <button type="button" className="admin-btn-primary" disabled={isPending} onClick={() => updateStatus("Confirmed")}>
                <CheckCircle2 size={14} /> Confirm
              </button>
              <button type="button" className="admin-btn-sm admin-btn-sm--info" disabled={isPending} onClick={() => updateStatus("Contacted")}>
                <PhoneCall size={13} /> Contacted
              </button>
              <button type="button" className="admin-btn-sm" disabled={isPending} onClick={() => updateStatus("Pending")}>
                <RotateCcw size={13} /> Pending
              </button>
              <button type="button" className="admin-btn-sm admin-btn-sm--danger" disabled={isPending} onClick={() => updateStatus("Cancelled")}>
                <XCircle size={13} /> Cancel
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal open={modalMode === "edit"} onClose={closeModal} title="Edit Reservation" size="md">
        {selectedRow && (
          <form className="admin-form" onSubmit={handleEditSubmit}>
            <label>
              <span>Guest Name</span>
              <input className="admin-input" name="name" defaultValue={selectedRow.name} required />
            </label>
            <label>
              <span>Date</span>
              <input className="admin-input" name="date" type="date" defaultValue={selectedRow.date} required />
            </label>
            <label>
              <span>Time</span>
              <input className="admin-input" name="time" type="time" defaultValue={selectedRow.time} required />
            </label>
            <label>
              <span>Guests</span>
              <input className="admin-input" name="guests" type="number" defaultValue={selectedRow.guests} min={1} max={30} required />
            </label>
            <label>
              <span>Status</span>
              <select className="admin-input admin-select" name="status" defaultValue={selectedRow.status}>
                <option value="Pending">Pending</option>
                <option value="Contacted">Contacted</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </label>
            <label>
              <span>Remarks</span>
              <textarea
                className="admin-input admin-textarea"
                name="remarks"
                rows={3}
                defaultValue={selectedRow.remarks || ""}
                placeholder="Internal notes..."
              />
            </label>
            <div className="admin-detail-actions">
              <button type="submit" className="admin-btn-primary" disabled={isPending}>
                {updateReservation.isPending ? "Saving…" : "Save Changes"}
              </button>
              <button type="button" className="admin-btn-sm" onClick={closeModal}>Cancel</button>
            </div>
          </form>
        )}
      </AdminModal>

      {/* Delete Modal */}
      <AdminModal open={modalMode === "delete"} onClose={closeModal} title="Delete Reservation" size="sm">
        {selectedRow && (
          <div className="admin-delete-confirm">
            <div className="admin-delete-confirm-icon">
              <Trash2 size={20} />
            </div>
            <p>
              Are you sure you want to delete the reservation for <strong>{selectedRow.name}</strong> on {selectedRow.date} at {selectedRow.time}?
            </p>
            <p className="admin-delete-confirm-hint">This action cannot be undone.</p>
            <div className="admin-detail-actions">
              <button type="button" className="admin-btn-sm admin-btn-sm--danger" disabled={isPending} onClick={handleDelete}>
                {deleteReservation.isPending ? "Deleting…" : "Yes, Delete"}
              </button>
              <button type="button" className="admin-btn-sm" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
