import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { restaurant } from "@/lib/constants";

export default function MapEmbed() {
  const mapsUrl = "https://www.google.com/maps?q=46001%20As%20Sulaymaniyah%20Iraq&output=embed";

  return (
    <section className="map-section">
      <div className="container map-wrap">
        <iframe
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={mapsUrl}
          title="Map showing As Sulaymaniyah, Iraq"
        />
        <Card className="map-card">
          <h2>Find Us</h2>
          <p>{restaurant.location}</p>
          <Button href="https://www.google.com/maps/search/?api=1&query=46001%20As%20Sulaymaniyah%20Iraq">
            Get Directions
          </Button>
        </Card>
      </div>
    </section>
  );
}
