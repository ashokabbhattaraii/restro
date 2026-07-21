"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initGSAP } from "@/lib/gsap";
import Image from "next/image";
import SectionHeader from "@/components/shared/SectionHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useEvents } from "@/hooks/useApi";
import type { EventItem } from "@/types";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function EventsGrid() {
  initGSAP();
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

  if (events.length === 0) {
    return (
      <section className="section" id="upcoming" ref={sectionRef}>
        <div className="container" style={{ textAlign: "center", padding: "60px 24px" }}>
          <SectionHeader
            title="Upcoming Events"
            text="Live music, cultural evenings, and special occasions — every week at our table."
          />
          <p style={{ color: "var(--muted)", marginTop: 32 }}>No upcoming events at this time. Check back soon!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="upcoming" ref={sectionRef}>
      <div className="container">
        <div ref={headerRef} style={{ opacity: 0 }}>
          <SectionHeader
            title="Upcoming Events"
            text="Live music, cultural evenings, and special occasions — every week at our table."
            align="left"
          />
        </div>

        {featured && (
          <div ref={featuredRef} style={{ opacity: 0, marginBottom: "32px" }}>
            <Card className="featured-event" style={{ overflow: "hidden", padding: 0, display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)" }}>
              <div style={{ position: "relative", minHeight: "400px", overflow: "hidden" }}>
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 55vw"
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(135deg, rgba(9,10,10,0.6) 0%, transparent 60%)",
                }} />
              </div>
              <div style={{ padding: "36px 32px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "12px" }}>
                <h2 style={{ margin: "4px 0 0", fontSize: "clamp(28px, 3.5vw, 42px)", lineHeight: 1.1 }}>{featured.title}</h2>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "14px", color: "var(--muted)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={14} /> {featured.date}
                  </span>
                  {featured.time && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={14} /> {featured.time}
                    </span>
                  )}
                </div>
                <p style={{ lineHeight: 1.7, color: "var(--body)", margin: "4px 0 8px" }}>{featured.description}</p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "4px" }}>
                  <Button href="/reservation">Reserve Your Seat</Button>
                  <Button href="/contact" variant="ghost">Get Notified</Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {rest.length > 0 && (
          <div className="event-grid" ref={gridRef}>
            {rest.map((event) => (
              <div key={event._id || event.id} className="event-grid-card" style={{ opacity: 0 }}>
                <Card style={{ overflow: "hidden", padding: 0, height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden" }}>
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(9,10,10,0.85) 0%, transparent 50%)",
                    }} />
                  </div>
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                    <h3 style={{ fontSize: "20px", fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{event.title}</h3>
                    <div style={{ display: "flex", gap: "12px", fontSize: "13px", color: "var(--muted)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Calendar size={13} /> {event.date}
                      </span>
                      {event.time && (
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <Clock size={13} /> {event.time}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--body)", margin: 0, flex: 1 }}>{event.description}</p>
                    <Button href="/reservation" variant="primary" style={{ alignSelf: "flex-start", marginTop: "8px", fontSize: "13px" }}>
                      Book This Night
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
