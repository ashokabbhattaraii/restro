import { Camera, Facebook, MapPin, MessageCircle, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { restaurant } from "@/lib/constants";

const rows = [
  { label: "Address", value: restaurant.location, icon: MapPin, href: undefined },
  { label: "Phone 1", value: restaurant.phoneOne, icon: Phone, href: `tel:${restaurant.phoneOne}` },
  { label: "Phone 2", value: restaurant.phoneTwo, icon: Phone, href: `tel:${restaurant.phoneTwo}` },
  { label: "WhatsApp", value: "Tap to chat", icon: MessageCircle, href: `https://wa.me/964${restaurant.phoneOne.slice(1)}` },
  { label: "Instagram", value: "@nepali.restaurant.bar", icon: Camera, href: "#" },
  { label: "Facebook", value: "Nepali Restaurant & Bar", icon: Facebook, href: "#" },
];

export default function ContactDetails() {
  return (
    <Card className="contact-card" style={{ height: "100%" }}>
      {/* Header */}
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

      {/* Contact rows */}
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

      {/* WhatsApp CTA */}
      <div style={{ marginTop: "28px" }}>
        <Button href={`https://wa.me/964${restaurant.phoneOne.slice(1)}`} style={{ width: "100%" }}>
          💬 Chat on WhatsApp
        </Button>
      </div>

      {/* Hours quick glance */}
      <div style={{
        marginTop: "24px",
        padding: "16px",
        border: "1px solid rgba(242,202,80,0.15)",
        borderRadius: "8px",
        background: "rgba(242,202,80,0.04)",
      }}>
        <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--primary)", margin: "0 0 6px" }}>
          Open Daily
        </p>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--body)", margin: 0 }}>
          {restaurant.hours}
        </p>
      </div>
    </Card>
  );
}
