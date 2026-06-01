"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useSWR from "swr";
import SectionHeader from "@/components/shared/SectionHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { fetcher } from "@/lib/utils";
import type { EventItem } from "@/types";

gsap.registerPlugin(ScrollTrigger);

export default function EventsPreviewSection() {
  const { data = [] } = useSWR<EventItem[]>("/api/events?limit=3", fetcher);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row || data.length === 0) return;

    const items = row.querySelectorAll<HTMLElement>(".event-card-wrapper");
    gsap.set(items, { opacity: 0, y: 60 });

    const trigger = ScrollTrigger.create({
      trigger: row,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        });
      },
    });

    return () => trigger.kill();
  }, [data]);

  return (
    <section className="section">
      <div className="container">
        <SectionHeader label="Upcoming Events" title="Evenings to Remember" />
        <div className="event-row" ref={rowRef}>
          {data.map((event) => (
            <div key={event.id} className="event-card-wrapper">
              <Card className="event-card">
                <Badge>{event.date}</Badge>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <Button href="/events" variant="ghost">Learn More</Button>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
