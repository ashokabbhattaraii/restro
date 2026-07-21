"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initGSAP } from "@/lib/gsap";
import Link from "next/link";
import { Camera, MessageCircle, ThumbsUp } from "lucide-react";
import { navLinks, restaurant } from "@/lib/constants";
import { useConfig } from "@/hooks/useConfig";
import type { DayHours } from "@/lib/config";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function formatHours(hours: Record<string, DayHours>): string {
  const openDays = DAYS.filter((d) => hours[d] && !hours[d].closed);
  if (openDays.length === 0) return "Closed";
  const ranges = openDays.map((d) => {
    const h = hours[d];
    return `${h.open.slice(0, 5)} – ${h.close.slice(0, 5)}`;
  });
  const unique = [...new Set(ranges)];
  if (unique.length === 1 && openDays.length === 7) return `Daily · ${unique[0]}`;
  return unique.join(" · ");
}

function hoursSummary(hours: Record<string, DayHours>): string {
  const openDays = DAYS.filter((d) => hours[d] && !hours[d].closed);
  if (openDays.length === 0) return "Closed today";
  const h = hours[openDays[0]];
  return `${h.open.slice(0, 5)} – ${h.close.slice(0, 5)}`;
}

export default function Footer() {
  initGSAP();
  const { config } = useConfig();
  const footerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cols = gridRef.current?.querySelectorAll(":scope > div") ?? [];
      gsap.set(cols, { opacity: 0, y: 40 });
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(cols, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" });
          gsap.fromTo(
            bottomRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.6, delay: 0.5 }
          );
        },
      });

      const socials = footerRef.current?.querySelectorAll(".social-row a") ?? [];
      socials.forEach((a) => {
        const el = a as HTMLElement;
        el.addEventListener("mouseenter", () => {
          gsap.to(el, {
            scale: 1.12,
            boxShadow: "0 0 16px rgba(242,202,80,0.4)",
            duration: 0.25,
          });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(el, { scale: 1, boxShadow: "none", duration: 0.3 });
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const phoneOne = config.phoneOne;
  const phoneTwo = config.phoneTwo;
  const location = config.location;

  const instagramUrl = config.socialInstagram
    ? `https://www.instagram.com/${config.socialInstagram.replace(/^@/, "")}/`
    : "https://www.instagram.com/";
  const facebookUrl = config.socialFacebook
    ? `https://www.facebook.com/${config.socialFacebook.replace(/\s+/g, "")}/`
    : "https://www.facebook.com/";

  return (
    <footer className="site-footer motif" ref={footerRef}>
      <div className="container footer-grid" ref={gridRef}>
        {/* Brand column */}
        <div>
          <Link className="footer-logo flex items-center gap-3 mb-4" href="/">
            <img
              src="/logo.png"
              alt={`${restaurant.name} Logo`}
              className="h-12 w-auto rounded-full object-contain filter drop-shadow-[0_0_10px_rgba(242,202,80,0.30)]"
            />
            <span className="font-display tracking-tight text-xl">{restaurant.name}</span>
          </Link>
          <p style={{ lineHeight: 1.7, maxWidth: "260px", fontSize: "14px" }}>
            Himalayan hospitality, refined interiors, and a menu shaped by Nepal,
            India, China, and Japan — in the heart of Sulaymaniyah.
          </p>

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "16px",
            padding: "8px 14px",
            border: "1px solid rgba(242,202,80,0.20)",
            borderRadius: "50px",
            fontSize: "12px",
          }}>
            <span style={{ color: "var(--primary)" }}>★★★★★</span>
            <span style={{ color: "var(--muted)" }}>4.9 · 240+ guests</span>
          </div>

          <div className="social-row">
            <a href={instagramUrl} aria-label="Instagram" rel="noopener noreferrer" target="_blank">
              <Camera size={18} />
            </a>
            <a href={facebookUrl} aria-label="Facebook" rel="noopener noreferrer" target="_blank">
              <ThumbsUp size={18} />
            </a>
            <a href={`https://wa.me/964${phoneOne.slice(1)}`} aria-label="WhatsApp" rel="noopener noreferrer" target="_blank">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3>Quick Links</h3>
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} style={{ transition: "color 180ms ease" }}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h3>Opening Hours</h3>
          <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--muted)", marginBottom: "6px" }}>
            {formatHours(config.hours)}
          </p>
          <p style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--body)" }}>
            Weekend reservations recommended.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3>Contact Info</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--primary)", margin: "0 0 4px" }}>
                Address
              </p>
              <p style={{ fontSize: "14px", margin: 0, lineHeight: 1.5 }}>{location}</p>
            </div>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--primary)", margin: "0 0 4px" }}>
                Phone
              </p>
              <a href={`tel:${phoneOne}`} style={{ display: "block", fontSize: "14px", color: "var(--body)" }}>
                {phoneOne}
              </a>
              <a href={`tel:${phoneTwo}`} style={{ display: "block", fontSize: "14px", color: "var(--body)" }}>
                {phoneTwo}
              </a>
            </div>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--primary)", margin: "0 0 4px" }}>
                Cuisine
              </p>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>{restaurant.cuisine}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-bottom" ref={bottomRef}>
        © 2026 {restaurant.name} · All Rights Reserved ·{" "}
        <Link href="/admin" style={{ color: "var(--muted)", opacity: 0.5, fontSize: "11px" }}>
          Admin
        </Link>
      </div>
    </footer>
  );
}
