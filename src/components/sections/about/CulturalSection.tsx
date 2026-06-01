import AnimatedSection from "@/components/shared/AnimatedSection";
import Button from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";

export default function CulturalSection() {
  return (
    <section className="section cultural-section">
      <div className="container split-grid">
        <AnimatedSection>
          <SectionLabel>Inspired by Nepal</SectionLabel>
          <h2>Inspired by Nepal</h2>
          <p>
            Nepali hospitality is generous without being loud. It lives in the
            second serving, the warm tea, the care taken with guests who are far
            from home. Our dining room translates that feeling into charcoal,
            glass, gold, and food made with patient hands.
          </p>
          <Button href="/reservation">Reserve With Us</Button>
        </AnimatedSection>
        <AnimatedSection className="mountain-line-art" direction="right" />
      </div>
    </section>
  );
}
