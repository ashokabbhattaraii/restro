import AnimatedSection from "@/components/shared/AnimatedSection";
import FoodImage from "@/components/shared/FoodImage";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { images } from "@/lib/constants";

export default function IntroSection() {
  return (
    <section className="section intro-section">
      <div className="container split-grid">
        <AnimatedSection direction="left">
          <Card className="story-card">
            <span className="side-line" />
            <h2>Where Himalayan Warmth Meets Refined Dining</h2>
            <p>
              Nestled in the heart of As Sulaymaniyah, Nepali Restaurant & Bar
              brings the rich flavors of Nepal, India, and China together in one
              extraordinary dining destination. Since 2018, we have served our
              guests authentic cuisine, crafted with tradition and love.
            </p>
            <Button href="/about" variant="ghost">Our Story</Button>
          </Card>
        </AnimatedSection>
        <AnimatedSection className="intro-images" direction="right" delay={0.12}>
          <FoodImage src={images.dining} alt="Luxury restaurant interior" />
          <FoodImage src={images.table} alt="Elegant table setting" />
        </AnimatedSection>
      </div>
    </section>
  );
}
