import AnimatedSection from "@/components/shared/AnimatedSection";
import FoodImage from "@/components/shared/FoodImage";
import SectionHeader from "@/components/shared/SectionHeader";
import Button from "@/components/ui/Button";
import { events, images, menuItems } from "@/lib/constants";

const previewImages = [
  images.dining,
  menuItems[1].image,
  images.bar,
  images.table,
  events[0].image,
];

export default function GalleryPreviewSection() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeader label="Gallery" title="A Glimpse Inside" />
        <AnimatedSection className="mosaic-grid">
          {previewImages.map((image, index) => (
            <a className={`mosaic-tile tile-${index + 1}`} href="/gallery" key={image}>
              <FoodImage src={image} alt="Restaurant gallery preview" />
              <span>View Gallery</span>
            </a>
          ))}
        </AnimatedSection>
        <div className="center-actions">
          <Button href="/gallery" variant="ghost">Explore Full Gallery</Button>
        </div>
      </div>
    </section>
  );
}
