import PageHero from "@/components/shared/PageHero";
import MasonryGrid from "@/components/sections/gallery/MasonryGrid";

export default function GalleryPage() {
  return (
    <main>
      <PageHero eyebrow="Gallery" title="Gallery" text="A Visual Journey" />
      <MasonryGrid />
    </main>
  );
}
