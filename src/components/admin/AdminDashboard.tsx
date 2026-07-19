"use client";

import { useState } from "react";
import { CalendarCheck, Clock, Mail, TrendingUp, Users, Wine, Sparkles, Moon, CheckCircle2, XCircle } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import AdminModal from "@/components/admin/AdminModal";
import { useReservations, useMenuItems, useMessages, useUpdateReservation } from "@/hooks/useApi";
import toast from "react-hot-toast";
import type { Reservation } from "@/types";

export default function AdminDashboard() {
  const [selectedRow, setSelectedRow] = useState<Reservation | null>(null);
  const { data: reservations = [] } = useReservations();
  const { data: menuItems = [] } = useMenuItems();
  const { data: messages = [] } = useMessages();
  const updateReservation = useUpdateReservation();

  const today = reservations.filter((r) => r.date === new Date().toISOString().slice(0, 10)).length;
  const pending = reservations.filter((r) => r.status === "Pending").length;
  const confirmed = reservations.filter((r) => r.status === "Confirmed").length;
  const unread = messages.filter((m) => !m.read).length;
  const totalGuests = reservations.reduce((sum, r) => sum + r.guests, 0);

  const drinkItems = menuItems.filter((i) => i.category?.toLowerCase() === "drinks & bar").length;
  const eveningBookings = reservations.filter((r) => {
    const hour = parseInt(r.time?.split(":")[0] || "0", 10);
    return r.date === new Date().toISOString().slice(0, 10) && hour >= 17;
  }).length;
  const featuredDrinks = menuItems.filter((i) => i.category?.toLowerCase() === "drinks & bar" && i.featured).length;

  const handleConfirm = async () => {
    if (!selectedRow) return;
    try {
      await updateReservation.mutateAsync({ id: (selectedRow._id || selectedRow.id)!, status: "Confirmed" });
      toast.success("Reservation confirmed");
      setSelectedRow(null);
    } catch {
      toast.error("Failed to confirm reservation");
    }
  };

  const handleCancel = async () => {
    if (!selectedRow) return;
    try {
      await updateReservation.mutateAsync({ id: (selectedRow._id || selectedRow.id)!, status: "Cancelled" });
      toast.success("Reservation cancelled");
      setSelectedRow(null);
    } catch {
      toast.error("Failed to cancel reservation");
    }
  };

  return (
    <div className="admin-page-content">
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

      <div className="stats-grid">
        <div className="stats-card stats-card--bar">
          <div className="stats-card-icon stats-card-icon--bar"><Wine size={16} strokeWidth={1.8} /></div>
          <div className="stats-card-body">
            <strong>{drinkItems}</strong>
            <span>Drinks &amp; Bar Items</span>
          </div>
          <div className="stats-card-trend stats-card-trend--bar">{featuredDrinks} featured</div>
        </div>
        <div className="stats-card stats-card--bar">
          <div className="stats-card-icon stats-card-icon--bar"><Moon size={16} strokeWidth={1.8} /></div>
          <div className="stats-card-body">
            <strong>{eveningBookings}</strong>
            <span>Tonight&apos;s Bookings</span>
          </div>
          <div className="stats-card-trend stats-card-trend--bar">{today > 0 ? `${((eveningBookings / today) * 100).toFixed(0)}% evening` : "—"}</div>
        </div>
        <div className="stats-card stats-card--bar">
          <div className="stats-card-icon stats-card-icon--bar"><Sparkles size={16} strokeWidth={1.8} /></div>
          <div className="stats-card-body">
            <strong>{confirmed}</strong>
            <span>Confirmed</span>
          </div>
          <div className="stats-card-trend stats-card-trend--bar">{reservations.length ? `${((confirmed / reservations.length) * 100).toFixed(0)}% rate` : "—"}</div>
        </div>
      </div>

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
          <strong>{reservations.length ? (totalGuests / reservations.length).toFixed(1) : "0"}</strong>
        </div>
        <div className="admin-insight-divider" />
        <div className="admin-insight">
          <span>Cancellations</span>
          <strong>{reservations.filter((r) => r.status === "Cancelled").length}</strong>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Recent Reservations</h2>
          <span className="admin-panel-badge">{reservations.length} total</span>
        </div>
        <DataTable<Reservation>
          columns={[
            { key: "name", label: "Guest" },
            { key: "date", label: "Date" },
            { key: "time", label: "Time" },
            { key: "guests", label: "Guests" },
            { key: "status", label: "Status" },
          ]}
          data={reservations.slice(0, 7)}
          onView={(row) => setSelectedRow(row)}
        />
      </div>

      <AdminModal open={!!selectedRow} onClose={() => setSelectedRow(null)} title="Reservation Details">
        {selectedRow && (
          <div className="admin-detail-grid">
            <div className="admin-detail-item">
              <label>Guest Name</label>
              <p>{selectedRow.name}</p>
            </div>
            <div className="admin-detail-item">
              <label>Date</label>
              <p>{selectedRow.date}</p>
            </div>
            <div className="admin-detail-item">
              <label>Time</label>
              <p>{selectedRow.time}</p>
            </div>
            <div className="admin-detail-item">
              <label>Guests</label>
              <p>{selectedRow.guests}</p>
            </div>
            <div className="admin-detail-item">
              <label>Occasion</label>
              <p>{selectedRow.occasion || "—"}</p>
            </div>
            <div className="admin-detail-item">
              <label>Status</label>
              <p>{selectedRow.status}</p>
            </div>
            <div className="admin-detail-actions">
              <button type="button" className="admin-btn-primary" onClick={handleConfirm}>
                <CheckCircle2 size={14} /> Confirm
              </button>
              <button type="button" className="admin-btn-sm admin-btn-sm--danger" onClick={handleCancel}>
                <XCircle size={13} /> Cancel
              </button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
