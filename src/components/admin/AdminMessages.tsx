"use client";

import { useState } from "react";
import { messages } from "@/lib/constants";
import { Send } from "lucide-react";
import type { Message } from "@/types";

export default function AdminMessages() {
  const [active, setActive] = useState<Message>(messages[0]);

  return (
    <div className="admin-page-content">
      <div className="admin-messages-layout">
        <div className="admin-messages-list">
          <div className="admin-panel-header">
            <h2>Messages</h2>
            <span className="admin-panel-badge">{messages.filter((m) => !m.read).length} unread</span>
          </div>
          <div className="admin-messages-items">
            {messages.map((msg) => (
              <button
                key={msg.id}
                type="button"
                className={`admin-message-item ${active?.id === msg.id ? "admin-message-item--active" : ""} ${!msg.read ? "admin-message-item--unread" : ""}`}
                onClick={() => setActive(msg)}
              >
                <div className="admin-message-item-dot" />
                <div>
                  <strong>{msg.name}</strong>
                  <span>{msg.subject}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="admin-message-detail">
          {active ? (
            <>
              <div className="admin-message-detail-header">
                <h3>{active.subject}</h3>
                <span>From: {active.name} {active.phone && `· ${active.phone}`}</span>
              </div>
              <div className="admin-message-detail-body">
                <p>{active.message}</p>
              </div>
              <div className="admin-message-reply">
                <textarea className="admin-input admin-textarea" placeholder="Write a reply..." rows={3} />
                <button type="button" className="admin-btn-primary">
                  <Send size={13} /> Reply
                </button>
              </div>
            </>
          ) : (
            <p className="admin-message-empty">Select a message to view</p>
          )}
        </div>
      </div>
    </div>
  );
}
