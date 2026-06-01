import AnimatedSection from "@/components/shared/AnimatedSection";
import Button from "@/components/ui/Button";
import { restaurant } from "@/lib/constants";

export default function ReservationCTASection() {
  return (
    <section className="section reservation-band motif">
      <AnimatedSection className="container narrow-center">
        <h2>Book Your Table Tonight</h2>
        <p>Reservations available 7 days a week. Call us or book online.</p>
        <Button href="/reservation">Make a Reservation</Button>
        <strong>{restaurant.phoneOne} · {restaurant.phoneTwo}</strong>
      </AnimatedSection>
    </section>
  );
}
