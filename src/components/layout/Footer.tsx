"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Camera, MessageCircle, ThumbsUp } from "lucide-react";
import { navLinks, restaurant } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
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

      /* Social icons hover glow */
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
            India, and China — in the heart of Sulaymaniyah.
          </p>

          {/* Rating strip */}
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
            <a href="https://www.instagram.com/" aria-label="Instagram" rel="noopener noreferrer" target="_blank">
              <Camera size={18} />
            </a>
            <a href="https://www.facebook.com/" aria-label="Facebook" rel="noopener noreferrer" target="_blank">
              <ThumbsUp size={18} />
            </a>
            <a href={`https://wa.me/964${restaurant.phoneOne.slice(1)}`} aria-label="WhatsApp" rel="noopener noreferrer" target="_blank">
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
          <p style={{ fontSize: "15px", fontWeight: 500, color: "var(--body)", marginBottom: "8px" }}>
            Mon – Sun
          </p>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--primary)", fontFamily: "var(--font-display), Georgia, serif", marginBottom: "12px" }}>
            11:00 AM – 11:00 PM
          </p>
          <p style={{ fontSize: "13px", lineHeight: 1.6 }}>
            Open every day of the year.<br />Weekend reservations recommended.
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
              <p style={{ fontSize: "14px", margin: 0, lineHeight: 1.5 }}>{restaurant.location}</p>
            </div>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--primary)", margin: "0 0 4px" }}>
                Phone
              </p>
              <a href={`tel:${restaurant.phoneOne}`} style={{ display: "block", fontSize: "14px", color: "var(--body)" }}>
                {restaurant.phoneOne}
              </a>
              <a href={`tel:${restaurant.phoneTwo}`} style={{ display: "block", fontSize: "14px", color: "var(--body)" }}>
                {restaurant.phoneTwo}
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

      {/* Bottom bar */}
      <div className="container footer-bottom" ref={bottomRef}>
        © 2026 {restaurant.name} · All Rights Reserved ·{" "}
        <Link href="/admin" style={{ color: "var(--muted)", opacity: 0.5, fontSize: "11px" }}>
          Admin
        </Link>
      </div>
    </footer>
  );
}
