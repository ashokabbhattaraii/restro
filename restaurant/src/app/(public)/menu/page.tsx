import ErrorBoundary from "@/components/shared/ErrorBoundary";
import MenuGrid from "@/components/sections/menu/MenuGrid";
import MenuHero from "@/components/sections/menu/MenuHero";
import ReservationCTASection from "@/components/sections/home/ReservationCTASection";

export default function MenuPage() {
  return (
    <main>
      <ErrorBoundary><MenuHero /></ErrorBoundary>
      <ErrorBoundary><MenuGrid /></ErrorBoundary>
      <ErrorBoundary><ReservationCTASection /></ErrorBoundary>
    </main>
  );
}
