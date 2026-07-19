"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, initGSAP } from "@/lib/gsap";
import Image from "next/image";
import SectionHeader from "@/components/shared/SectionHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useEvents } from "@/hooks/useApi";
import type { EventItem } from "@/types";


function EventPosterCard({ event, index }: { event: EventItem; index: number }) {
  return (
    <div
      className="event-poster glass-panel"
      style={{
        position: "relative",
        minHeight: index === 0 ? "480px" : "380px",
        overflow: "hidden",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {event.image && (
        <Image
          src={event.image}
          alt={event.title}
          fill
          style={{ objectFit: "cover", zIndex: 0 }}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      )}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(9,10,10,0.98) 0%, rgba(9,10,10,0.55) 55%, rgba(9,10,10,0.1) 100%)",
        zIndex: 1,
        transition: "background 300ms ease",
      }} />

      <div style={{ position: "relative", zIndex: 2, padding: "24px 28px 28px" }}>
        <Badge style={{ marginBottom: "10px" }}>{event.date}</Badge>
        {event.type && (
          <div style={{
            display: "inline-block",
            marginBottom: "8px",
            marginLeft: "8px",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: "rgba(242,202,80,0.8)",
          }}>
            · {event.type}
          </div>
        )}
        <h3 style={{
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: index === 0 ? "26px" : "20px",
          fontWeight: 700,
          color: "#ffffff",
          margin: "0 0 10px",
          textShadow: "0 2px 12px rgba(0,0,0,0.9)",
        }}>
          {event.title}
        </h3>
        <p style={{
          fontSize: "14px",
          color: "#b8b09f",
          margin: "0 0 18px",
          lineHeight: 1.5,
          textShadow: "0 1px 6px rgba(0,0,0,0.9)",
        }}>
          {event.description}
        </p>
        <Button href="/events" variant="ghost" style={{ fontSize: "12px" }}>
          Learn More
        </Button>
      </div>
    </div>
  );
}

export default function EventsPreviewSection() {
  initGSAP();
  const { data: items = [] } = useEvents(3);
  const rowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.52, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%", once: true },
        }
      );

      const row = rowRef.current;
      if (!row) return;
      const cards = row.querySelectorAll<HTMLElement>(".event-poster");
      gsap.set(cards, { opacity: 0, y: 70, scale: 0.94 });

      ScrollTrigger.create({
        trigger: row,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.52, stagger: 0.11, ease: "power3.out",
          });
        },
      });

      cards.forEach((card) => {
        const img = card.querySelector("img");
        if (!img) return;
        ScrollTrigger.create({
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
          onUpdate: (self) => {
            gsap.set(img, { y: self.progress * 40 - 20 });
          },
        });
      });
    });

    return () => ctx.revert();
  }, [items]);

  return (
    <section className="section" style={{ overflow: "hidden" }}>
      <div className="container">
        <div ref={headerRef} style={{ opacity: 0 }}>
          <SectionHeader
            label="Upcoming Events"
            title="Evenings to Remember"
            text="Live music, cultural celebrations, and curated dining experiences — every week."
          />
        </div>

        <div
          className="event-row"
          ref={rowRef}
        >
          {items.slice(0, 3).map((event, i) => (
            <EventPosterCard key={event._id || event.id} event={event} index={i} />
          ))}
        </div>

        <div className="center-actions" style={{ marginTop: "40px" }}>
          <Button href="/events" variant="ghost">View All Events</Button>
        </div>
      </div>
    </section>
  );
}
