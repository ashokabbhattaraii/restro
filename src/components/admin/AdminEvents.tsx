"use client";

import FoodImage from "@/components/shared/FoodImage";
import { events } from "@/lib/constants";
import { Calendar } from "lucide-react";

export default function AdminEvents() {
  return (
    <div className="admin-page-content">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Events</h2>
          <button type="button" className="admin-btn-primary">+ Add Event</button>
        </div>
        <div className="admin-event-grid">
          {events.map((event) => (
            <div className="admin-event-card" key={event.id}>
              <div className="admin-event-card-img">
                <FoodImage src={event.image} alt={event.title} />
              </div>
              <div className="admin-event-card-body">
                <span className="admin-badge">{event.type}</span>
                <h3>{event.title}</h3>
                <p><Calendar size={12} /> {event.date} · {event.time}</p>
                <div className="admin-event-card-actions">
                  <button type="button" className="admin-btn-sm">Edit</button>
                  <button type="button" className="admin-btn-sm admin-btn-sm--danger">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
