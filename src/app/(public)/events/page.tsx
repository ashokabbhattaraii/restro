import ErrorBoundary from "@/components/shared/ErrorBoundary";
import PageHero from "@/components/shared/PageHero";
import EventsGrid from "@/components/sections/events/EventsGrid";
import OffersSection from "@/components/sections/events/OffersSection";

export default function EventsPage() {
  return (
    <main>
      <ErrorBoundary><PageHero eyebrow="Events" title="Events & Offers" text="Celebrate with Us" /></ErrorBoundary>
      <ErrorBoundary><EventsGrid /></ErrorBoundary>
      <ErrorBoundary><OffersSection /></ErrorBoundary>
    </main>
  );
}
