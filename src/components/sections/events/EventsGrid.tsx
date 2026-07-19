"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import SectionHeader from "@/components/shared/SectionHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { useEvents } from "@/hooks/useApi";
import type { EventItem } from "@/types";

gsap.registerPlugin(ScrollTrigger);

export default function EventsGrid() {
  const { data: events = [] } = useEvents();
  const sectionRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [featured, ...rest] = events as EventItem[];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.52, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%", once: true },
        }
      );

      if (featuredRef.current) {
        gsap.fromTo(
          featuredRef.current,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.62, ease: "power3.out",
            scrollTrigger: { trigger: featuredRef.current, start: "top 82%", once: true },
          }
        );
      }

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll<HTMLElement>(".event-grid-card");
        gsap.set(cards, { opacity: 0, y: 60, scale: 0.92 });
        ScrollTrigger.create({
          trigger: gridRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.11, ease: "power3.out" });
          },
        });
      }
    });

    return () => ctx.revert();
  }, [events]);

  return (
    <section className="section" id="upcoming" ref={sectionRef}>
      <div className="container">
        <div ref={headerRef} style={{ opacity: 0 }}>
          <SectionHeader
            title="Upcoming Events"
            label="Events"
            text="Live music, cultural evenings, and special occasions — every week at our table."
            align="left"
          />
        </div>

        {featured && (
          <div ref={featuredRef} style={{ opacity: 0, marginBottom: "28px" }}>
            <Card className="featured-event" style={{ overflow: "hidden" }}>
              <div style={{
                position: "relative",
                minHeight: "380px",
                borderRadius: "8px",
                overflow: "hidden",
                flex: "0 0 42%",
              }}>
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to right, rgba(9,10,10,0) 60%, rgba(9,10,10,0.3) 100%)",
                }} />
              </div>

              <div className="events-featured-body">
                <Badge>{featured.date} · {featured.time}</Badge>
                {featured.type && (
                  <span style={{
                    fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em",
                    textTransform: "uppercase" as const, color: "var(--primary)", marginTop: "4px",
                    display: "block",
                  }}>
                    {featured.type}
                  </span>
                )}
                <h2>{featured.title}</h2>
                <p style={{ lineHeight: 1.7, maxWidth: "420px" }}>{featured.description}</p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" as const, marginTop: "8px" }}>
                  <Button href="/reservation">Reserve Your Seat</Button>
                  <Button href="/contact" variant="ghost">Get Notified</Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="event-grid" ref={gridRef}>
          {rest.map((event) => (
            <div key={event._id || event.id} className="event-grid-card" style={{ opacity: 0 }}>
              <div style={{
                position: "relative",
                minHeight: "340px",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid rgba(242,202,80,0.18)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}>
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  style={{ objectFit: "cover", zIndex: 0 }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(9,10,10,0.98) 0%, rgba(9,10,10,0.5) 55%, transparent 100%)",
                  zIndex: 1,
                }} />
                <div style={{ position: "relative", zIndex: 2, padding: "24px" }}>
                  <Badge style={{ marginBottom: "8px" }}>{event.date}</Badge>
                  <h3 style={{
                    fontFamily: "var(--font-display), Georgia, serif",
                    fontSize: "20px",
                    color: "#ffffff",
                    margin: "0 0 8px",
                    textShadow: "0 2px 10px rgba(0,0,0,0.9)",
                  }}>
                    {event.title}
                  </h3>
                  <p style={{
                    fontSize: "13px", color: "#b8b09f", margin: "0 0 16px",
                    textShadow: "0 1px 6px rgba(0,0,0,0.9)",
                  }}>
                    {event.description}
                  </p>
                  <Button href="/reservation" variant="ghost" style={{ fontSize: "12px" }}>
                    Book This Night
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
