"use client";

import { useState, useMemo, useCallback } from "react";
import { useAdminMessages, useUpdateMessage, useDeleteMessage } from "@/hooks/useApi";
import DataTable from "@/components/admin/DataTable";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminModal from "@/components/admin/AdminModal";
import {
  Search,
  Mail,
  Star,
  CheckCheck,
  Trash2,
  Loader2,
  MessageCircle,
  ShieldCheck,
  ShieldX,
  Clock,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import toast from "react-hot-toast";
import type { Message } from "@/types";

const CONTACT_TYPE_LABELS: Record<Message["contactType"], string> = {
  feedback: "Feedback",
  enquiry: "Enquiry",
  other: "Other",
};

const CONTACT_TYPE_CLASSES: Record<Message["contactType"], string> = {
  feedback: "badge-feedback",
  enquiry: "badge-enquiry",
  other: "badge-other",
};

const READ_OPTIONS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
] as const;

const VERIFIED_OPTIONS = [
  { value: "all", label: "All" },
  { value: "verified", label: "Verified" },
  { value: "unverified", label: "Unverified" },
] as const;

type ActiveTab = "feedback" | "other";
type ModalMode = "view" | "delete" | "verify" | "unverify" | null;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminMessages() {
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">("all");
  const [verifiedFilter, setVerifiedFilter] = useState<"all" | "verified" | "unverified">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState<Message | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("feedback");
  const [isVerifyPending, setIsVerifyPending] = useState(false);

  const { data: messages = [], isLoading } = useAdminMessages({
    contactType: activeTab === "feedback" ? "feedback" : "other",
    verified:
      activeTab === "feedback"
        ? verifiedFilter === "verified"
          ? true
          : verifiedFilter === "unverified"
          ? false
          : undefined
        : undefined,
    read: readFilter === "unread" ? false : readFilter === "read" ? true : undefined,
  });

  const updateMessage = useUpdateMessage();
  const deleteMessage = useDeleteMessage();
  const isPending = updateMessage.isPending || deleteMessage.isPending;

  const debouncedSearch = useDebouncedCallback(
    useCallback((val: string) => { setSearch(val); setCurrentPage(1); }, []),
    300
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return messages
      .filter((m) => {
        const matchSearch = !search ||
          m.name.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q) ||
          (m.email?.toLowerCase().includes(q) ?? false);
        const matchRead = readFilter === "all" ||
          (readFilter === "unread" && !m.read) ||
          (readFilter === "read" && m.read);
        return matchSearch && matchRead;
      })
      .sort((a, b) => {
        if (a.read !== b.read) return a.read ? 1 : -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [messages, search, readFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginatedRows = useMemo(
    () => filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [filtered, currentPage, rowsPerPage]
  );

  const { data: allMessages = [] } = useAdminMessages({});
  const feedbackTotal = allMessages.filter((m) => m.contactType === "feedback").length;
  const otherTotal = allMessages.filter((m) => m.contactType !== "feedback").length;

  const unreadCount = allMessages.filter((m) => !m.read).length;
  const verifiedCount = messages.filter((m) => m.verified).length;
  const unverifiedCount = messages.filter((m) => !m.verified).length;

  const openModal = useCallback((row: Message | null, mode: ModalMode) => {
    setSelectedRow(row);
    setModalMode(mode);
    if (mode === "verify" || mode === "unverify") setIsVerifyPending(false);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedRow(null);
    setModalMode(null);
    setIsVerifyPending(false);
  }, []);

  const handleVerify = useCallback(async (msg: Message, verify: boolean) => {
    if (!msg._id && !msg.id) return;
    setIsVerifyPending(true);
    try {
      await updateMessage.mutateAsync({ 
        id: msg._id || msg.id!, 
        verified: verify, 
        read: true 
      });
      toast.success(verify ? "Feedback verified" : "Feedback marked as unverified");
      closeModal();
    } catch {
      toast.error("Failed to update feedback");
    } finally {
      setIsVerifyPending(false);
    }
  }, [updateMessage, closeModal]);

  const handleDelete = useCallback(async () => {
    if (!selectedRow) return;
    try {
      await deleteMessage.mutateAsync(selectedRow._id || selectedRow.id!);
      toast.success("Message deleted");
      closeModal();
    } catch {
      toast.error("Failed to delete message");
    }
  }, [selectedRow, deleteMessage, closeModal]);

  const openMailto = (msg: Message) => {
    const subject = `Re: ${msg.subject}`;
    const body = `\n\n---\nOriginal message from ${msg.name} (${msg.email}):\n${msg.message}`;
    window.location.href = `mailto:${msg.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (isLoading) {
    return (
      <div className="admin-empty-state">
        <Loader2 size={24} className="animate-spin" style={{ color: "var(--a-gold)" }} />
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>
          <MessageCircle size={17} style={{ marginRight: 8, color: "var(--a-gold)" }} />
          Messages
        </h2>
        <div className="admin-panel-header-actions">
          {unreadCount > 0 && (
            <span className="admin-panel-badge" style={{ background: "#e74c3c", color: "#fff" }}>
              <AlertCircle size={11} style={{ marginRight: 4 }} /> {unreadCount} unread
            </span>
          )}
        </div>
      </div>

      <div className="admin-tabs" role="tablist" style={{ marginBottom: 16 }}>
        <button
          role="tab"
          aria-selected={activeTab === "feedback"}
          className={`admin-tab ${activeTab === "feedback" ? "admin-tab--active" : ""}`}
          onClick={() => { setActiveTab("feedback"); setVerifiedFilter("all"); setCurrentPage(1); }}
        >
          <Star size={14} /> Feedback <span className="admin-tab-count">{feedbackTotal}</span>
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "other"}
          className={`admin-tab ${activeTab === "other" ? "admin-tab--active" : ""}`}
          onClick={() => { setActiveTab("other"); setCurrentPage(1); }}
        >
          <Mail size={14} /> Other <span className="admin-tab-count">{otherTotal}</span>
        </button>
      </div>

      <div className="admin-filters">
        <div className="admin-search-wrap">
          <Search size={15} className="admin-search-icon" />
          <input
            className="admin-input admin-search-input"
            type="text"
            placeholder="Search name, subject, message, email…"
            defaultValue={search}
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>

        <select
          className="admin-input admin-select"
          value={readFilter}
          onChange={(e) => { setReadFilter(e.target.value as typeof readFilter); setCurrentPage(1); }}
        >
          {READ_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        {activeTab === "feedback" && (
          <select
            className="admin-input admin-select"
            value={verifiedFilter}
            onChange={(e) => { setVerifiedFilter(e.target.value as typeof verifiedFilter); setCurrentPage(1); }}
          >
            {VERIFIED_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        )}
      </div>

      <DataTable<Message>
        columns={[
          {
            key: "subject",
            label: "Subject",
            render: (_value, row) => (
              <div style={{ minWidth: 0 }}>
                <div style={{ 
                  fontWeight: row.read ? 500 : 700, 
                  color: "var(--a-text)", 
                  whiteSpace: "nowrap", 
                  overflow: "hidden", 
                  textOverflow: "ellipsis" 
                }}>
                  {row.subject}
                </div>
                <div style={{ fontSize: 12, color: "var(--a-text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {row.name} &middot; {row.email}
                </div>
              </div>
            ),
          },
          {
            key: "contactType",
            label: "Type",
            render: (value) => (
              <span className={`admin-badge ${CONTACT_TYPE_CLASSES[value as Message["contactType"]] || "badge-other"}`}>
                {CONTACT_TYPE_LABELS[value as Message["contactType"]] || value}
              </span>
            ),
          },
          {
            key: "verified",
            label: activeTab === "feedback" ? "Verified" : "—",
            render: (value, row) =>
              activeTab === "feedback" ? (
                <span className={`admin-badge ${value ? "badge-success" : "badge-warning"}`}>
                  {value ? (
                    <><ShieldCheck size={11} style={{ marginRight: 4 }} /> Verified</>
                  ) : (
                    <><ShieldX size={11} style={{ marginRight: 4 }} /> Unverified</>
                  )}
                </span>
              ) : (
                <span style={{ color: "var(--a-text-3)" }}>—</span>
              ),
          },
          {
            key: "read",
            label: "Status",
            render: (value) => (
              <span className={`admin-badge ${value ? "badge-success" : "badge-danger"}`}>
                {value ? (
                  <><CheckCheck size={11} style={{ marginRight: 4 }} /> Read</>
                ) : (
                  <><Mail size={11} style={{ marginRight: 4 }} /> Unread</>
                )}
              </span>
            ),
          },
          {
            key: "createdAt",
            label: "Received",
            render: (value) => (
              <span style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                gap: 4, 
                color: "var(--a-text-3)", 
                fontSize: 12, 
                whiteSpace: "nowrap" 
              }}>
                <Clock size={12} /> {formatDateShort(String(value))}
              </span>
            ),
          },
        ]}
        data={paginatedRows}
        onView={(row) => openModal(row, "view")}
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

      <AdminModal open={modalMode === "view" && !!selectedRow} onClose={closeModal} title="Message Details" size="lg">
        {selectedRow && (
          <div className="admin-detail-grid">
            <div className="admin-detail-header-row">
              <span className={`admin-badge ${CONTACT_TYPE_CLASSES[selectedRow.contactType] || "badge-other"}`}>
                {CONTACT_TYPE_LABELS[selectedRow.contactType]}
              </span>
              <div>
                <p className="admin-detail-subject">{selectedRow.subject}</p>
                <p className="admin-detail-sender">{selectedRow.name} &middot; {selectedRow.email}</p>
              </div>
            </div>

            <div className="admin-detail-item">
              <label>Phone</label>
              <p>{selectedRow.phone || "—"}</p>
            </div>

            <div className="admin-detail-item">
              <label>Status</label>
              <p>
                <span className={`admin-badge ${selectedRow.read ? "badge-success" : "badge-danger"}`}>
                  {selectedRow.read ? (
                    <><CheckCheck size={11} style={{ marginRight: 4 }} /> Read</>
                  ) : (
                    <><Mail size={11} style={{ marginRight: 4 }} /> Unread</>
                  )}
                </span>
              </p>
            </div>

            {activeTab === "feedback" && (
              <div className="admin-detail-item">
                <label>Verified</label>
                <p>
                  <span className={`admin-badge ${selectedRow.verified ? "badge-success" : "badge-warning"}`}>
                    {selectedRow.verified ? (
                      <><ShieldCheck size={11} style={{ marginRight: 4 }} /> Verified</>
                    ) : (
                      <><ShieldX size={11} style={{ marginRight: 4 }} /> Unverified</>
                    )}
                  </span>
                </p>
              </div>
            )}

            {selectedRow.rating && activeTab === "feedback" && (
              <div className="admin-detail-item">
                <label>Rating</label>
                <p>
                  <span className="admin-badge badge-info" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <Star size={11} fill="currentColor" /> {selectedRow.rating} / 5
                  </span>
                </p>
              </div>
            )}

            <div className="admin-detail-item admin-detail-item--full">
              <label>Message</label>
              <p className="admin-detail-message">{selectedRow.message}</p>
            </div>

            <div className="admin-detail-item admin-detail-item--full">
              <label>Received</label>
              <p className="admin-detail-meta">{formatDate(selectedRow.createdAt)}</p>
            </div>

            {selectedRow.replied && selectedRow.reply && (
              <div className="admin-detail-item admin-detail-item--full admin-detail-reply">
                <label>Admin Reply</label>
                <p className="admin-detail-reply-text">{selectedRow.reply}</p>
                <p className="admin-detail-meta">Replied at: {selectedRow.replyAt ? formatDate(selectedRow.replyAt) : "—"}</p>
              </div>
            )}

            <div className="admin-detail-actions">
              {!selectedRow.read && (
                <button
                  type="button"
                  className="admin-btn-sm"
                  onClick={() => updateMessage.mutateAsync({ id: selectedRow._id || selectedRow.id!, read: true }).then(() => closeModal())}
                  disabled={updateMessage.isPending}
                >
                  <CheckCheck size={13} /> Mark Read
                </button>
              )}

              {activeTab === "feedback" && !selectedRow.verified && (
                <button
                  type="button"
                  className="admin-btn-primary"
                  onClick={() => openModal(selectedRow, "verify")}
                  disabled={updateMessage.isPending}
                >
                  <ShieldCheck size={13} /> Verify
                </button>
              )}

              {activeTab === "feedback" && selectedRow.verified && (
                <button
                  type="button"
                  className="admin-btn-sm"
                  onClick={() => openModal(selectedRow, "unverify")}
                  disabled={updateMessage.isPending}
                >
                  <ShieldX size={13} /> Unverify
                </button>
              )}

              {activeTab === "other" && selectedRow.email && (
                <button type="button" className="admin-btn-primary" onClick={() => openMailto(selectedRow)}>
                  <ArrowUpRight size={13} /> Reply in Mail
                </button>
              )}

              <button type="button" className="admin-btn-sm" onClick={closeModal}>Close</button>

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

      {modalMode === "verify" && selectedRow && (
        <AdminModal open={true} onClose={closeModal} title="Verify Feedback" size="sm">
          <div className="admin-delete-confirm" style={{ textAlign: "center" }}>
            <div className="admin-delete-confirm-icon" style={{ background: "rgba(74, 222, 128, 0.1)", color: "#4ade80" }}>
              <ShieldCheck size={20} />
            </div>
            <p>Verify this feedback from <strong>{selectedRow.name}</strong>?</p>
            <p className="admin-delete-confirm-hint">Subject: {selectedRow.subject}</p>
            <p className="admin-delete-confirm-hint">This will mark it as verified for public display.</p>
            <div className="admin-detail-actions" style={{ justifyContent: "center", marginTop: 16 }}>
              <button type="button" className="admin-btn-primary" onClick={() => handleVerify(selectedRow, true)} disabled={isVerifyPending}>
                {isVerifyPending ? "Verifying…" : "Yes, Verify"}
              </button>
              <button type="button" className="admin-btn-sm" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </AdminModal>
      )}

      {modalMode === "unverify" && selectedRow && (
        <AdminModal open={true} onClose={closeModal} title="Unverify Feedback" size="sm">
          <div className="admin-delete-confirm" style={{ textAlign: "center" }}>
            <div className="admin-delete-confirm-icon" style={{ background: "rgba(250, 204, 21, 0.1)", color: "#facc15" }}>
              <ShieldX size={20} />
            </div>
            <p>Remove verification from feedback by <strong>{selectedRow.name}</strong>?</p>
            <p className="admin-delete-confirm-hint">Subject: {selectedRow.subject}</p>
            <p className="admin-delete-confirm-hint">This will mark it as unverified and hide from public display.</p>
            <div className="admin-detail-actions" style={{ justifyContent: "center", marginTop: 16 }}>
              <button type="button" className="admin-btn-sm" style={{ background: "#fef3c7", borderColor: "#fcd34d", color: "#854d0e" }} onClick={() => handleVerify(selectedRow, false)} disabled={isVerifyPending}>
                {isVerifyPending ? "Unverifying…" : "Yes, Unverify"}
              </button>
              <button type="button" className="admin-btn-sm" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </AdminModal>
      )}

      <AdminModal open={modalMode === "delete" && !!selectedRow} onClose={closeModal} title="Delete Message" size="sm">
        {selectedRow && (
          <div className="admin-delete-confirm">
            <div className="admin-delete-confirm-icon"><Trash2 size={20} /></div>
            <p>Delete message from <strong>{selectedRow.name}</strong>?</p>
            <p className="admin-delete-confirm-hint">Subject: {selectedRow.subject}</p>
            <p className="admin-delete-confirm-hint">This action cannot be undone.</p>
            <div className="admin-detail-actions">
              <button type="button" className="admin-btn-sm admin-btn-sm--danger" disabled={deleteMessage.isPending} onClick={handleDelete}>
                {deleteMessage.isPending ? "Deleting…" : "Yes, Delete"}
              </button>
              <button type="button" className="admin-btn-sm" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}