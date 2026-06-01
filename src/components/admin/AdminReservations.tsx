"use client";

import { useState } from "react";
import DataTable from "@/components/admin/DataTable";
import AdminModal from "@/components/admin/AdminModal";
import { reservations } from "@/lib/constants";
import type { DataTableRow } from "@/components/admin/DataTable";

export default function AdminReservations() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [viewRow, setViewRow] = useState<DataTableRow | null>(null);
  const [editRow, setEditRow] = useState<DataTableRow | null>(null);

  const filtered = reservations.filter((r) => {
    const matchName = r.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "all" || r.status.toLowerCase() === status;
    return matchName && matchStatus;
  });

  return (
    <div className="admin-page-content">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>All Reservations</h2>
          <span className="admin-panel-badge">{filtered.length} found</span>
        </div>
        <div className="admin-filters">
          <input
            className="admin-input"
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="admin-input admin-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <DataTable
          columns={["name", "date", "time", "guests", "occasion", "status"]}
          rows={filtered}
          actions
          onView={(row) => setViewRow(row)}
          onEdit={(row) => setEditRow(row)}
        />
      </div>

      {/* View Modal */}
      <AdminModal open={!!viewRow} onClose={() => setViewRow(null)} title="Reservation Details">
        {viewRow && (
          <div className="admin-detail-grid">
            <div className="admin-detail-item">
              <label>Guest Name</label>
              <p>{String(viewRow.name)}</p>
            </div>
            <div className="admin-detail-item">
              <label>Phone</label>
              <p>{String(viewRow.phone || "—")}</p>
            </div>
            <div className="admin-detail-item">
              <label>Date</label>
              <p>{String(viewRow.date)}</p>
            </div>
            <div className="admin-detail-item">
              <label>Time</label>
              <p>{String(viewRow.time)}</p>
            </div>
            <div className="admin-detail-item">
              <label>Party Size</label>
              <p>{String(viewRow.guests)} guests</p>
            </div>
            <div className="admin-detail-item">
              <label>Occasion</label>
              <p>{String(viewRow.occasion || "—")}</p>
            </div>
            <div className="admin-detail-item admin-detail-item--full">
              <label>Status</label>
              <p>{String(viewRow.status)}</p>
            </div>
            <div className="admin-detail-actions">
              <button type="button" className="admin-btn-primary" onClick={() => setViewRow(null)}>Confirm</button>
              <button type="button" className="admin-btn-sm admin-btn-sm--danger" onClick={() => setViewRow(null)}>Cancel</button>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal open={!!editRow} onClose={() => setEditRow(null)} title="Edit Reservation">
        {editRow && (
          <form className="admin-form" onSubmit={(e) => { e.preventDefault(); setEditRow(null); }}>
            <label>
              <span>Guest Name</span>
              <input className="admin-input" defaultValue={String(editRow.name)} />
            </label>
            <label>
              <span>Date</span>
              <input className="admin-input" type="date" defaultValue={String(editRow.date)} />
            </label>
            <label>
              <span>Time</span>
              <input className="admin-input" type="time" defaultValue={String(editRow.time)} />
            </label>
            <label>
              <span>Guests</span>
              <input className="admin-input" type="number" defaultValue={String(editRow.guests)} min={1} max={20} />
            </label>
            <label>
              <span>Status</span>
              <select className="admin-input admin-select" defaultValue={String(editRow.status)}>
                <option>Confirmed</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
            </label>
            <div className="admin-detail-actions">
              <button type="submit" className="admin-btn-primary">Save Changes</button>
              <button type="button" className="admin-btn-sm" onClick={() => setEditRow(null)}>Cancel</button>
            </div>
          </form>
        )}
      </AdminModal>
    </div>
  );
}
