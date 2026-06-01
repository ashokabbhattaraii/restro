"use client";

import useSWR from "swr";
import AnimatedSection from "@/components/shared/AnimatedSection";
import FoodImage from "@/components/shared/FoodImage";
import SectionHeader from "@/components/shared/SectionHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { fetcher } from "@/lib/utils";
import type { EventItem } from "@/types";

export default function EventsGrid() {
  const { data = [] } = useSWR<EventItem[]>("/api/events", fetcher);
  const [featured, ...rest] = data;

  return (
    <section className="section">
      <div className="container">
        <SectionHeader title="Upcoming Events" align="left" />
        {featured ? (
          <AnimatedSection>
            <Card className="featured-event">
              <FoodImage src={featured.image} alt={featured.title} />
              <div>
                <Badge>{featured.date}</Badge>
                <h2>{featured.title}</h2>
                <p>{featured.description}</p>
                <Button href="/contact" variant="ghost">Get Notified</Button>
              </div>
            </Card>
          </AnimatedSection>
        ) : null}
        <div className="event-grid">
          {rest.map((event, index) => (
            <AnimatedSection key={event.id} delay={index * 0.08}>
              <Card className="event-poster">
                <FoodImage src={event.image} alt={event.title} />
                <Badge>{event.date}</Badge>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <Button href="/reservation" variant="ghost">Book This Night</Button>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
