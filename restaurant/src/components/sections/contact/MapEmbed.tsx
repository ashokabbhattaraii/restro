"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useConfig } from "@/hooks/useConfig";

export default function MapEmbed() {
  const { config } = useConfig();
  const location = encodeURIComponent(config.location);
  const mapsUrl = `https://www.google.com/maps?q=${location}&output=embed`;

  return (
    <section className="map-section">
      <div className="container map-wrap">
        <iframe
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={mapsUrl}
          title={`Map showing ${config.location}`}
        />
        <Card className="map-card">
          <h2>Find Us</h2>
          <p>{config.location}</p>
          <Button href={`https://www.google.com/maps/search/?api=1&query=${location}`}>
            Get Directions
          </Button>
        </Card>
      </div>
    </section>
  );
}
