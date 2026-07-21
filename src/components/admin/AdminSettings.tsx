"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Settings, Clock, Users, Phone, MapPin, Loader2, Save, Ban, CalendarX,
  Camera, Globe, X, Gift, Tag, Plus, CheckCircle2, AlertTriangle, UtensilsCrossed,
  Star, MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Toggle from "@/components/ui/Toggle";
import type { RestaurantConfig, DayHours } from "@/lib/config";
import { fetcher, poster } from "@/lib/api/client";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function LoadingSkeleton() {
  return (
    <div className="admin-page-content">
      <div className="admin-panel">
        <div className="settings-loading">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="settings-loading-block">
              <div className="settings-loading-line" style={{ width: `${40 + i * 15}%`, height: 14 }} />
              <div className="settings-loading-line" style={{ width: `100%`, height: 36 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const [config, setConfig] = useState<RestaurantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [dirty, setDirty] = useState(false);
  const saveBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetcher<RestaurantConfig>("/api/config")
      .then((data) => {
        setConfig(data);
        setLastSaved(new Date());
      })
      .catch(() => toast.error("Failed to load config"))
      .finally(() => setLoading(false));
  }, []);

  const updateField = useCallback(<K extends keyof RestaurantConfig>(key: K, value: RestaurantConfig[K]) => {
    setConfig((prev) => (prev ? { ...prev, [key]: value } : prev));
    setDirty(true);
  }, []);

  const updateDay = useCallback((day: string, field: keyof DayHours, value: boolean | string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const hours = { ...prev.hours, [day]: { ...prev.hours[day], [field]: value } };
      setDirty(true);
      return { ...prev, hours };
    });
  }, []);

  const addClosedDate = useCallback((dateStr: string) => {
    if (!dateStr) return;
    setConfig((prev) => {
      if (!prev) return prev;
      if (prev.closedDates.includes(dateStr)) return prev;
      setDirty(true);
      return { ...prev, closedDates: [...prev.closedDates, dateStr] };
    });
  }, []);

  const removeClosedDate = useCallback((dateStr: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      setDirty(true);
      return { ...prev, closedDates: prev.closedDates.filter((d) => d !== dateStr) };
    });
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const updated = await poster<RestaurantConfig>("/api/config", config);
      setConfig(updated);
      setLastSaved(new Date());
      setDirty(false);
      toast.success("Settings saved successfully", { duration: 2000 });
      if (saveBtnRef.current) {
        saveBtnRef.current.style.background = "#16a34a";
        setTimeout(() => { if (saveBtnRef.current) { saveBtnRef.current.style.background = ""; } }, 1200);
      }
    } catch {
      toast.error("Failed to save settings — please try again");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (!config) {
    return (
      <div className="admin-page-content">
        <div className="admin-panel" style={{ textAlign: "center", padding: 48 }}>
          <AlertTriangle size={28} style={{ color: "var(--a-text-3)", margin: "0 auto 12px" }} />
          <p style={{ color: "var(--a-text-3)" }}>Failed to load settings.</p>
          <button type="button" className="admin-btn-primary" onClick={() => window.location.reload()} style={{ marginTop: 12 }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-content">
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1><Settings size={20} /> Settings</h1>
          <p>Manage your restaurant configuration</p>
        </div>
        <div className="admin-page-header-actions">
          {lastSaved && (
            <span className="settings-save-indicator">
              <CheckCircle2 size={12} />
              Last saved: {lastSaved.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button
            ref={saveBtnRef}
            type="button"
            className="admin-btn-primary"
            onClick={handleSave}
            disabled={saving || !dirty}
          >
            {saving ? (
              <><Loader2 size={14} className="animate-spin" /> Saving…</>
            ) : (
              <><Save size={14} /> {dirty ? "Save Changes" : "Saved"}</>
            )}
          </button>
        </div>
      </div>

      <div className="admin-panel">
        {/* ═══════════ RESERVATIONS ═══════════ */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Ban size={16} />
            <div>
              <strong>Reservation Status</strong>
              <span>Control whether guests can book tables online</span>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="settings-row">
              <div className="settings-row-info">
                <strong>Accepting Reservations</strong>
                <p>When disabled, the reservation form shows a closure message instead.</p>
              </div>
              <Toggle checked={config.acceptingReservations} onChange={(v) => updateField("acceptingReservations", v)} label="" />
            </div>
            {!config.acceptingReservations && (
              <div className="settings-field" style={{ marginTop: 12 }}>
                <span>Closure Message</span>
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
        </div>

        {/* ═══════════ BOOKING LIMITS ═══════════ */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Users size={16} />
            <div>
              <strong>Booking Limits</strong>
              <span>Maximum party size, advance booking window, and time slot intervals</span>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="settings-fields-row">
              <div className="settings-field">
                <span>Max Guests</span>
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
                <span>Max Days Ahead</span>
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
                <span>Slot Interval</span>
                <select
                  className="admin-input admin-select"
                  value={config.slotIntervalMinutes}
                  onChange={(e) => updateField("slotIntervalMinutes", Number(e.target.value))}
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ HOURS ═══════════ */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Clock size={16} />
            <div>
              <strong>Opening Hours</strong>
              <span>Set daily operating hours. Toggle closed for days off.</span>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="settings-hours-grid">
              <div className="settings-hours-header">
                <span>Day</span>
                <span>Open</span>
                <span>Close</span>
                <span>Closed</span>
              </div>
              {DAYS.map((day) => {
                const dayConfig = config.hours[day] || { open: "09:00", close: "01:00", closed: false };
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
        </div>

        {/* ═══════════ CLOSED DATES ═══════════ */}
        <div className="settings-card">
          <div className="settings-card-header">
            <CalendarX size={16} />
            <div>
              <strong>Closed Dates</strong>
              <span>Holidays, maintenance days, or special closures</span>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="settings-inline-input">
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
                  if (input.value) { addClosedDate(input.value); input.value = ""; }
                }}
              >
                Add Date
              </button>
            </div>
            {config.closedDates.length === 0 ? (
              <p className="settings-empty">No closed dates set.</p>
            ) : (
              <div className="settings-tag-list">
                {config.closedDates.map((date) => (
                  <span key={date} className="settings-tag">
                    {date}
                    <button type="button" className="settings-tag-remove" onClick={() => removeClosedDate(date)} aria-label={`Remove ${date}`}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ═══════════ CONTACT INFO ═══════════ */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Phone size={16} />
            <div>
              <strong>Contact Information</strong>
              <span>Phone numbers and location displayed on the site</span>
            </div>
          </div>
          <div className="settings-card-body">
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
            <div className="settings-field" style={{ marginTop: 12 }}>
              <span><MapPin size={13} /> Location</span>
              <input className="admin-input" value={config.location} onChange={(e) => updateField("location", e.target.value)} />
            </div>
          </div>
        </div>

        {/* ═══════════ SOCIAL MEDIA ═══════════ */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Camera size={16} />
            <div>
              <strong>Social Media</strong>
              <span>Instagram and Facebook profiles</span>
            </div>
          </div>
          <div className="settings-card-body">
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
        </div>

        {/* ═══════════ OFFERS ═══════════ */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Gift size={16} />
            <div>
              <strong>Offers &amp; Deals</strong>
              <span>Show or hide the offers section on the public site</span>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="settings-row">
              <div className="settings-row-info">
                <strong>Show Offers Section</strong>
                <p>When disabled, the offers section won&apos;t appear on the site.</p>
              </div>
              <Toggle checked={config.showOffers} onChange={(v) => updateField("showOffers", v)} label="" />
            </div>
          </div>
        </div>

        {/* ═══════════ EVENT TYPES ═══════════ */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Tag size={16} />
            <div>
              <strong>Event Types</strong>
              <span>Labels used in the events admin form</span>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="settings-inline-input">
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
              <p className="settings-empty">No event types defined.</p>
            ) : (
              <div className="settings-tag-list">
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

        {/* ═══════════ MENU CATEGORIES ═══════════ */}
        <div className="settings-card">
          <div className="settings-card-header">
            <UtensilsCrossed size={16} />
            <div>
              <strong>Menu Categories</strong>
              <span>Categories available in the menu admin form</span>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="settings-inline-input">
              <input
                className="admin-input"
                type="text"
                id="menu-category-input"
                placeholder="e.g. Japanese"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val && !config.menuCategories.includes(val)) {
                      updateField("menuCategories", [...config.menuCategories, val]);
                    }
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => {
                  const input = document.getElementById("menu-category-input") as HTMLInputElement;
                  const val = input.value.trim();
                  if (val && !config.menuCategories.includes(val)) {
                    updateField("menuCategories", [...config.menuCategories, val]);
                  }
                  input.value = "";
                }}
              >
                <Plus size={14} /> Add
              </button>
            </div>
            {config.menuCategories.length === 0 ? (
              <p className="settings-empty">No menu categories defined.</p>
            ) : (
              <div className="settings-tag-list">
                {config.menuCategories.map((cat) => (
                  <span key={cat} className="settings-tag">
                    {cat}
                    <button
                      type="button"
                      className="settings-tag-remove"
                      onClick={() => updateField("menuCategories", config.menuCategories.filter((c) => c !== cat))}
                      aria-label={`Remove ${cat}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ═══════════ GALLERY CATEGORIES ═══════════ */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Camera size={16} />
            <div>
              <strong>Gallery Categories</strong>
              <span>Categories available in the gallery admin form</span>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="settings-inline-input">
              <input
                className="admin-input"
                type="text"
                id="gallery-category-input"
                placeholder="e.g. Interior"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val && !config.galleryCategories.includes(val)) {
                      updateField("galleryCategories", [...config.galleryCategories, val]);
                    }
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => {
                  const input = document.getElementById("gallery-category-input") as HTMLInputElement;
                  const val = input.value.trim();
                  if (val && !config.galleryCategories.includes(val)) {
                    updateField("galleryCategories", [...config.galleryCategories, val]);
                  }
                  input.value = "";
                }}
              >
                <Plus size={14} /> Add
              </button>
            </div>
            {config.galleryCategories.length === 0 ? (
              <p className="settings-empty">No gallery categories defined.</p>
            ) : (
              <div className="settings-tag-list">
                {config.galleryCategories.map((cat) => (
                  <span key={cat} className="settings-tag">
                    {cat}
                    <button
                      type="button"
                      className="settings-tag-remove"
                      onClick={() => updateField("galleryCategories", config.galleryCategories.filter((c) => c !== cat))}
                      aria-label={`Remove ${cat}`}
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
    </div>
  );
}
