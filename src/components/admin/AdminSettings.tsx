"use client";

import { useState, useEffect, useCallback } from "react";
import { Settings, Clock, Users, Phone, MapPin, Loader2, Save, Ban, CalendarX, Camera, Globe, X, Gift, Tag, Plus } from "lucide-react";
import toast from "react-hot-toast";
import Toggle from "@/components/ui/Toggle";
import type { RestaurantConfig, DayHours } from "@/lib/config";
import { fetcher, poster } from "@/lib/api/client";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AdminSettings() {
  const [config, setConfig] = useState<RestaurantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetcher<RestaurantConfig>("/api/config")
      .then((data) => setConfig(data))
      .catch(() => toast.error("Failed to load config"))
      .finally(() => setLoading(false));
  }, []);

  const updateField = useCallback(<K extends keyof RestaurantConfig>(key: K, value: RestaurantConfig[K]) => {
    setConfig((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const updateDay = useCallback((day: string, field: keyof DayHours, value: boolean | string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const hours = { ...prev.hours, [day]: { ...prev.hours[day], [field]: value } };
      return { ...prev, hours };
    });
  }, []);

  const addClosedDate = useCallback((dateStr: string) => {
    if (!dateStr) return;
    setConfig((prev) => {
      if (!prev) return prev;
      if (prev.closedDates.includes(dateStr)) return prev;
      return { ...prev, closedDates: [...prev.closedDates, dateStr] };
    });
  }, []);

  const removeClosedDate = useCallback((dateStr: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      return { ...prev, closedDates: prev.closedDates.filter((d) => d !== dateStr) };
    });
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const updated = await poster<RestaurantConfig>("/api/config", config);
      setConfig(updated);
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page-content">
        <div className="admin-panel" style={{ textAlign: "center", padding: 48 }}>
          <Loader2 size={24} className="animate-spin" style={{ color: "var(--primary)" }} />
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="admin-page-content">
        <div className="admin-panel" style={{ textAlign: "center", padding: 48, color: "var(--a-text-3)" }}>
          Failed to load settings.
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-content">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2><Settings size={17} /> Restaurant Settings</h2>
          <button type="button" className="admin-btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : <><Save size={13} /> Save Changes</>}
          </button>
        </div>

        {/* Reservation Toggle */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Ban size={15} />
            <span>Reservation Status</span>
          </div>
          <div className="settings-row">
            <div className="settings-row-info">
              <strong>Accepting Reservations</strong>
              <p>When disabled, the reservation form shows a message instead.</p>
            </div>
            <Toggle checked={config.acceptingReservations} onChange={(v) => updateField("acceptingReservations", v)} label="" />
          </div>
          {!config.acceptingReservations && (
            <div className="settings-field">
              <span>Closure Message (shown to guests)</span>
              <textarea
                className="admin-input admin-textarea"
                rows={2}
                value={config.message}
                onChange={(e) => updateField("message", e.target.value)}
                placeholder="e.g. We are currently closed for the holidays. See you in January!"
              />
            </div>
          )}
        </div>

        {/* Booking Limits */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Users size={15} />
            <span>Booking Limits</span>
          </div>
          <div className="settings-fields-row">
            <div className="settings-field">
              <span>Max Guests Per Party</span>
              <input
                className="admin-input"
                type="number"
                min={1}
                max={100}
                value={config.maxGuests}
                onChange={(e) => updateField("maxGuests", Number(e.target.value))}
              />
            </div>
            <div className="settings-field">
              <span>Max Days Ahead for Booking</span>
              <input
                className="admin-input"
                type="number"
                min={1}
                max={365}
                value={config.maxDaysAhead}
                onChange={(e) => updateField("maxDaysAhead", Number(e.target.value))}
              />
            </div>
            <div className="settings-field">
              <span>Time Slot Interval (minutes)</span>
              <select
                className="admin-input admin-select"
                value={config.slotIntervalMinutes}
                onChange={(e) => updateField("slotIntervalMinutes", Number(e.target.value))}
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={60}>60 min</option>
              </select>
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Clock size={15} />
            <span>Opening Hours</span>
          </div>
          <div className="settings-hours-grid">
            <div className="settings-hours-header">
              <span>Day</span>
              <span>Open</span>
              <span>Close</span>
              <span>Closed</span>
            </div>
            {DAYS.map((day) => {
              const dayConfig = config.hours[day] || { open: "11:00", close: "23:00", closed: false };
              return (
                <div key={day} className={`settings-hours-row ${dayConfig.closed ? "settings-hours-row--closed" : ""}`}>
                  <span className="settings-hours-day">{day}</span>
                  <input
                    className="admin-input"
                    type="time"
                    value={dayConfig.open}
                    disabled={dayConfig.closed}
                    onChange={(e) => updateDay(day, "open", e.target.value)}
                  />
                  <input
                    className="admin-input"
                    type="time"
                    value={dayConfig.close}
                    disabled={dayConfig.closed}
                    onChange={(e) => updateDay(day, "close", e.target.value)}
                  />
                  <Toggle checked={dayConfig.closed} onChange={(v) => updateDay(day, "closed", v)} label="" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Closed Dates */}
        <div className="settings-section">
          <div className="settings-section-header">
            <CalendarX size={15} />
            <span>Closed Dates (holidays, maintenance)</span>
          </div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <input
              className="admin-input"
              type="date"
              id="closed-date-picker"
              onBlur={(e) => addClosedDate(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addClosedDate((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => {
                const input = document.getElementById("closed-date-picker") as HTMLInputElement;
                if (input.value) {
                  addClosedDate(input.value);
                  input.value = "";
                }
              }}
            >
              Add
            </button>
          </div>
          {config.closedDates.length === 0 ? (
            <p style={{ fontSize: "13px", color: "var(--a-text-3)", margin: 0 }}>No closed dates set.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {config.closedDates.map((date) => (
                <span key={date} className="settings-tag">
                  {date}
                  <button
                    type="button"
                    className="settings-tag-remove"
                    onClick={() => removeClosedDate(date)}
                    aria-label={`Remove ${date}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Phone size={15} />
            <span>Contact Information</span>
          </div>
          <div className="settings-fields-row">
            <div className="settings-field">
              <span>Primary Phone</span>
              <input className="admin-input" value={config.phoneOne} onChange={(e) => updateField("phoneOne", e.target.value)} />
            </div>
            <div className="settings-field">
              <span>Secondary Phone</span>
              <input className="admin-input" value={config.phoneTwo} onChange={(e) => updateField("phoneTwo", e.target.value)} />
            </div>
          </div>
          <div className="settings-field">
            <span><MapPin size={13} /> Location</span>
            <input className="admin-input" value={config.location} onChange={(e) => updateField("location", e.target.value)} />
          </div>
        </div>

        {/* Social Media */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Camera size={15} />
            <span>Social Media</span>
          </div>
          <div className="settings-fields-row">
            <div className="settings-field">
              <span><Camera size={13} /> Instagram Handle</span>
              <input className="admin-input" value={config.socialInstagram} onChange={(e) => updateField("socialInstagram", e.target.value)} placeholder="@your.handle" />
            </div>
            <div className="settings-field">
              <span><Globe size={13} /> Facebook Page</span>
              <input className="admin-input" value={config.socialFacebook} onChange={(e) => updateField("socialFacebook", e.target.value)} placeholder="Your Page Name" />
            </div>
          </div>
        </div>

        {/* Offers / Deals Toggle */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Gift size={15} />
            <span>Offers &amp; Deals</span>
          </div>
          <div className="settings-row">
            <div className="settings-row-info">
              <strong>Show Offers Section</strong>
              <p>When disabled, the offers section won't appear on the site.</p>
            </div>
            <Toggle checked={config.showOffers} onChange={(v) => updateField("showOffers", v)} label="" />
          </div>
        </div>

        {/* Event Types */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Tag size={15} />
            <span>Event Types</span>
          </div>
          <p style={{ fontSize: "13px", color: "var(--a-text-3)", margin: "0 0 12px" }}>
            Manage event type labels used in the admin events form.
          </p>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <input
              className="admin-input"
              type="text"
              id="event-type-input"
              placeholder="e.g. Live Music"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val && !config.eventTypes.includes(val)) {
                    updateField("eventTypes", [...config.eventTypes, val]);
                  }
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => {
                const input = document.getElementById("event-type-input") as HTMLInputElement;
                const val = input.value.trim();
                if (val && !config.eventTypes.includes(val)) {
                  updateField("eventTypes", [...config.eventTypes, val]);
                }
                input.value = "";
              }}
            >
              <Plus size={14} /> Add
            </button>
          </div>
          {config.eventTypes.length === 0 ? (
            <p style={{ fontSize: "13px", color: "var(--a-text-3)", margin: 0 }}>No event types defined.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {config.eventTypes.map((type) => (
                <span key={type} className="settings-tag">
                  {type}
                  <button
                    type="button"
                    className="settings-tag-remove"
                    onClick={() => updateField("eventTypes", config.eventTypes.filter((t) => t !== type))}
                    aria-label={`Remove ${type}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
