"use client";

import { Camera, Globe, MapPin, MessageCircle, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useConfig } from "@/hooks/useConfig";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function hoursDisplay(hours: Record<string, { open: string; close: string; closed: boolean }>) {
  const lines = DAYS.map((day) => {
    const h = hours[day];
    if (!h || h.closed) return { day, text: "Closed" };
    return { day, text: `${h.open.slice(0, 5)} – ${h.close.slice(0, 5)}` };
  });
  return lines;
}

export default function ContactDetails() {
  const { config } = useConfig();
  const phoneOne = config.phoneOne;
  const phoneTwo = config.phoneTwo;
  const location = config.location;

  const instagramUrl = config.socialInstagram
    ? `https://www.instagram.com/${config.socialInstagram.replace(/^@/, "")}/`
    : "#";
  const facebookUrl = config.socialFacebook
    ? `https://www.facebook.com/${config.socialFacebook.replace(/\s+/g, "")}/`
    : "#";

  const rows = [
    { label: "Address", value: location, icon: MapPin, href: undefined },
    { label: "Phone 1", value: phoneOne, icon: Phone, href: `tel:${phoneOne}` },
    { label: "Phone 2", value: phoneTwo, icon: Phone, href: `tel:${phoneTwo}` },
    { label: "WhatsApp", value: "Tap to chat", icon: MessageCircle, href: `https://wa.me/964${phoneOne.slice(1)}` },
    { label: "Instagram", value: config.socialInstagram || "Instagram", icon: Camera, href: instagramUrl },
    { label: "Facebook", value: config.socialFacebook || "Facebook", icon: Globe, href: facebookUrl },
  ];

  return (
    <Card className="contact-card" style={{ height: "100%" }}>
      <div style={{ marginBottom: "28px" }}>
        <div style={{
          width: "40px", height: "3px",
          background: "linear-gradient(90deg, var(--primary), transparent)",
          marginBottom: "12px", borderRadius: "2px",
        }} />
        <h2 style={{ margin: 0, fontSize: "26px" }}>Contact Details</h2>
        <p style={{ marginTop: "8px", fontSize: "14px" }}>
          Reach us by phone, walk in, or find us on social media.
        </p>
      </div>

      <div className="contact-info-card">
        {rows.map((row) => {
          const Icon = row.icon;
          const content = (
            <div className="contact-row-item" key={row.label}>
              <div className="contact-icon-box" aria-hidden="true">
                <Icon size={18} />
              </div>
              <div>
                <span className="contact-label">{row.label}</span>
                <span className="contact-value">{row.value}</span>
              </div>
            </div>
          );

          return row.href ? (
            <a key={row.label} href={row.href} style={{ color: "inherit", textDecoration: "none" }}>
              {content}
            </a>
          ) : content;
        })}
      </div>

      <div style={{ marginTop: "28px" }}>
        <Button href={`https://wa.me/964${phoneOne.slice(1)}`} style={{ width: "100%" }}>
          💬 Chat on WhatsApp
        </Button>
      </div>

      <div style={{
        marginTop: "24px",
        padding: "16px",
        border: "1px solid rgba(242,202,80,0.15)",
        borderRadius: "8px",
        background: "rgba(242,202,80,0.04)",
      }}>
        <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--primary)", margin: "0 0 6px" }}>
          Opening Hours
        </p>
        {DAYS.map((day) => {
          const h = config.hours[day];
          if (!h || h.closed) return null;
          return (
            <p key={day} style={{ fontSize: "14px", margin: "2px 0", display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted)" }}>{day}</span>
              <span style={{ fontWeight: 600 }}>{h.open.slice(0, 5)} – {h.close.slice(0, 5)}</span>
            </p>
          );
        })}
      </div>
    </Card>
  );
}
