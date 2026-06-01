"use client";

import { useState } from "react";
import { CalendarCheck, ChefHat, Clock, Mail, TrendingUp, TrendingDown, Users } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import AdminModal from "@/components/admin/AdminModal";
import { menuItems, messages, reservations } from "@/lib/constants";
import type { DataTableRow } from "@/components/admin/DataTable";

export default function AdminDashboard() {
  const [selectedRow, setSelectedRow] = useState<DataTableRow | null>(null);

  const today = reservations.filter((r) => r.date === new Date().toISOString().slice(0, 10)).length || 5;
  const pending = reservations.filter((r) => r.status === "Pending").length;
  const confirmed = reservations.filter((r) => r.status === "Confirmed").length;
  const unread = messages.filter((m) => !m.read).length;
  const totalGuests = reservations.reduce((sum, r) => sum + r.guests, 0);

  return (
    <div className="admin-page-content">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-card-icon"><CalendarCheck size={16} strokeWidth={1.8} /></div>
          <div className="stats-card-body">
            <strong>{today}</strong>
            <span>Today&apos;s Bookings</span>
          </div>
          <div className="stats-card-trend stats-card-trend--up"><TrendingUp size={10} /> 12%</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-icon stats-card-icon--warning"><Clock size={16} strokeWidth={1.8} /></div>
          <div className="stats-card-body">
            <strong>{pending}</strong>
            <span>Pending Review</span>
          </div>
          <div className="stats-card-trend stats-card-trend--warning">{pending > 0 ? "Action needed" : "All clear"}</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-icon"><Users size={16} strokeWidth={1.8} /></div>
          <div className="stats-card-body">
            <strong>{totalGuests}</strong>
            <span>Total Guests</span>
          </div>
          <div className="stats-card-trend stats-card-trend--up"><TrendingUp size={10} /> 8%</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-icon stats-card-icon--info"><Mail size={16} strokeWidth={1.8} /></div>
          <div className="stats-card-body">
            <strong>{unread}</strong>
            <span>Unread Messages</span>
          </div>
          {unread > 0 && <div className="stats-card-trend stats-card-trend--warning">New</div>}
        </div>
      </div>

      {/* Quick insights row */}
      <div className="admin-insights-row">
        <div className="admin-insight">
          <span>Confirmed</span>
          <strong>{confirmed}</strong>
        </div>
        <div className="admin-insight-divider" />
        <div className="admin-insight">
          <span>Menu Items</span>
          <strong>{menuItems.length}</strong>
        </div>
        <div className="admin-insight-divider" />
        <div className="admin-insight">
          <span>Avg Party Size</span>
          <strong>{(totalGuests / reservations.length).toFixed(1)}</strong>
        </div>
        <div className="admin-insight-divider" />
        <div className="admin-insight">
          <span>Cancellations</span>
          <strong>{reservations.filter((r) => r.status === "Cancelled").length}</strong>
        </div>
      </div>

      {/* Reservations table */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Recent Reservations</h2>
          <span className="admin-panel-badge">{reservations.length} total</span>
        </div>
        <DataTable
          columns={["name", "date", "time", "guests", "status"]}
          rows={reservations.slice(0, 7)}
          actions
          onView={(row) => setSelectedRow(row)}
        />
      </div>

      {/* View modal */}
      <AdminModal
        open={!!selectedRow}
        onClose={() => setSelectedRow(null)}
        title="Reservation Details"
      >
        {selectedRow && (
          <div className="admin-detail-grid">
            <div className="admin-detail-item">
              <label>Guest Name</label>
              <p>{String(selectedRow.name)}</p>
            </div>
            <div className="admin-detail-item">
              <label>Date</label>
              <p>{String(selectedRow.date)}</p>
            </div>
            <div className="admin-detail-item">
              <label>Time</label>
              <p>{String(selectedRow.time)}</p>
            </div>
            <div className="admin-detail-item">
              <label>Guests</label>
              <p>{String(selectedRow.guests)}</p>
            </div>
            <div className="admin-detail-item">
              <label>Occasion</label>
              <p>{String(selectedRow.occasion || "—")}</p>
            </div>
            <div className="admin-detail-item">
              <label>Status</label>
              <p>{String(selectedRow.status)}</p>
            </div>
            <div className="admin-detail-actions">
              <button type="button" className="admin-btn-primary">Confirm</button>
              <button type="button" className="admin-btn-sm admin-btn-sm--danger">Cancel Reservation</button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
