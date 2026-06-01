import PageHero from "@/components/shared/PageHero";
import EventsGrid from "@/components/sections/events/EventsGrid";
import OffersSection from "@/components/sections/events/OffersSection";

export default function EventsPage() {
  return (
    <main>
      <PageHero eyebrow="Events" title="Events & Offers" text="Celebrate with Us" />
      <EventsGrid />
      <OffersSection />
    </main>
  );
}
