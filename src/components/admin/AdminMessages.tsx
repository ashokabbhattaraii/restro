"use client";

import { useState, useMemo, useCallback } from "react";
import { useMessages, useUpdateMessage } from "@/hooks/useApi";
import AdminPagination from "@/components/admin/AdminPagination";
import { Send, Mail, Phone, Search, Loader2, Filter, CheckCheck } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import toast from "react-hot-toast";
import type { Message } from "@/types";

export default function AdminMessages() {
  const [replyText, setReplyText] = useState("");
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">("all");
  const { data: messages = [] } = useMessages();
  const updateMessage = useUpdateMessage();
  const [active, setActive] = useState<Message | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const debouncedSearch = useDebouncedCallback(
    useCallback((val: string) => {
      setSearch(val);
      setCurrentPage(1);
    }, []),
    250
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return messages.filter((m) => {
      const matchSearch = !search ||
        m.name.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q) ||
        (m.email || "").toLowerCase().includes(q);
      const matchRead =
        readFilter === "all" ? true :
        readFilter === "unread" ? !m.read :
        m.read;
      return matchSearch && matchRead;
    });
  }, [messages, search, readFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginatedMessages = useMemo(
    () => filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
    [filtered, currentPage, rowsPerPage]
  );

  const handleSelect = useCallback((msg: Message) => {
    setActive(msg);
    if (!msg.read) {
      updateMessage.mutate(
        { id: (msg._id || msg.id)!, read: true },
        { onSuccess: () => toast.success("Marked as read") }
      );
    }
  }, [updateMessage]);

  const handleReply = useCallback(() => {
    if (!replyText.trim() || !active) return;
    toast.success("Reply sent (simulated)");
    setReplyText("");
  }, [replyText, active]);

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages]);

  return (
    <div className="admin-page-content">
      <div className="admin-messages-layout">
        <div className="admin-messages-list">
          <div className="admin-panel-header">
            <h2>Messages</h2>
            <span className="admin-panel-badge">{unreadCount} unread</span>
          </div>

          <div className="admin-messages-filters">
            <div className="admin-search-wrap">
              <Search size={14} className="admin-search-icon" />
              <input
                className="admin-input admin-search-input"
                type="text"
                placeholder="Search name, subject, message…"
                defaultValue={search}
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>
            <div className="admin-messages-filter-row">
              {(["all", "unread", "read"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`admin-chip ${readFilter === opt ? "admin-chip--active" : ""}`}
                  onClick={() => { setReadFilter(opt); setCurrentPage(1); }}
                >
                  {opt === "all" ? <Filter size={11} /> : opt === "read" ? <CheckCheck size={11} /> : null}
                  {opt === "all" ? "All" : opt === "unread" ? `Unread (${unreadCount})` : "Read"}
                </button>
              ))}
            </div>
          </div>

          <div className="admin-messages-items">
            {paginatedMessages.length === 0 ? (
              <p className="admin-empty">No messages match your search.</p>
            ) : (
              paginatedMessages.map((msg) => {
                const isActive = active?._id === msg._id || active?.id === msg.id;
                return (
                  <button
                    key={msg._id || msg.id}
                    type="button"
                    className={`admin-message-item ${isActive ? "admin-message-item--active" : ""} ${!msg.read ? "admin-message-item--unread" : ""}`}
                    onClick={() => handleSelect(msg)}
                  >
                    <div className="admin-message-item-dot" />
                    <div>
                      <strong>{msg.name}</strong>
                      <span>{msg.subject}</span>
                    </div>
                  </button>
                );
              })
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

        <div className="admin-message-detail">
          {active ? (
            <>
              <div className="admin-message-detail-header">
                <h3>{active.subject}</h3>
                <div className="admin-message-detail-meta">
                  <span><Mail size={12} /> {active.email || "—"}</span>
                  {active.phone && <span><Phone size={12} /> {active.phone}</span>}
                </div>
              </div>
              <div className="admin-message-detail-body">
                <p>{active.message}</p>
              </div>
              <div className="admin-message-reply">
                <textarea
                  className="admin-input admin-textarea"
                  placeholder="Write a reply..."
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button type="button" className="admin-btn-primary" disabled={!replyText.trim()} onClick={handleReply}>
                  <Send size={13} /> Reply
                </button>
              </div>
            </>
          ) : (
            <div className="admin-message-empty">
              <Mail size={32} />
              <p>Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
