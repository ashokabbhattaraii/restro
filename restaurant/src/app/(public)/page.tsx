import ErrorBoundary from "@/components/shared/ErrorBoundary";
import EventsPreviewSection from "@/components/sections/home/EventsPreviewSection";
import FeaturedDishesSection from "@/components/sections/home/FeaturedDishesSection";
import GalleryPreviewSection from "@/components/sections/home/GalleryPreviewSection";
import HeroSection from "@/components/sections/home/HeroSection";
import IntroSection from "@/components/sections/home/IntroSection";
import ReservationCTASection from "@/components/sections/home/ReservationCTASection";
import TestimonialsSection from "@/components/sections/home/TestimonialsSection";

export default function HomePage() {
  return (
    <main>
      <ErrorBoundary><HeroSection /></ErrorBoundary>
      <ErrorBoundary><IntroSection /></ErrorBoundary>
      <ErrorBoundary><FeaturedDishesSection /></ErrorBoundary>
      <ErrorBoundary><ReservationCTASection /></ErrorBoundary>
      <ErrorBoundary><EventsPreviewSection /></ErrorBoundary>
      <ErrorBoundary><TestimonialsSection /></ErrorBoundary>
      <ErrorBoundary><GalleryPreviewSection /></ErrorBoundary>
    </main>
  );
}
