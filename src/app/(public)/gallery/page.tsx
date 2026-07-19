import ErrorBoundary from "@/components/shared/ErrorBoundary";
import PageHero from "@/components/shared/PageHero";
import MasonryGrid from "@/components/sections/gallery/MasonryGrid";

export default function GalleryPage() {
  return (
    <main>
      <ErrorBoundary><PageHero eyebrow="Gallery" title="Gallery" text="A Visual Journey" /></ErrorBoundary>
      <ErrorBoundary><MasonryGrid /></ErrorBoundary>
    </main>
  );
}
