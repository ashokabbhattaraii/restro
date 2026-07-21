import ErrorBoundary from "@/components/shared/ErrorBoundary";
import ContactSection from "@/components/sections/contact/ContactSection";

export default function ContactPage() {
  return (
    <main>
      <ErrorBoundary><ContactSection /></ErrorBoundary>
    </main>
  );
}
