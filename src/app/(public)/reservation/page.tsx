import ErrorBoundary from "@/components/shared/ErrorBoundary";
import ReservationForm from "@/components/sections/reservation/ReservationForm";

export default function ReservationPage() {
  return (
    <main>
      <ErrorBoundary><ReservationForm /></ErrorBoundary>
    </main>
  );
}
