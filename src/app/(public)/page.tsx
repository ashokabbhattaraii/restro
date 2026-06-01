import EventsPreviewSection from "@/components/sections/home/EventsPreviewSection";
import FeaturedDishesSection from "@/components/sections/home/FeaturedDishesSection";
import GalleryPreviewSection from "@/components/sections/home/GalleryPreviewSection";
import HeroSection from "@/components/sections/home/HeroSection";
import IntroSection from "@/components/sections/home/IntroSection";
import ReservationCTASection from "@/components/sections/home/ReservationCTASection";
import TestimonialsSection from "@/components/sections/home/TestimonialsSection";
import Divider from "@/components/ui/Divider";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <IntroSection />
      <Divider />
      <FeaturedDishesSection />
      <ReservationCTASection />
      <EventsPreviewSection />
      <TestimonialsSection />
      <GalleryPreviewSection />
    </main>
  );
}
