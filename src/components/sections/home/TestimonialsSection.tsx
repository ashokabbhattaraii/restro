import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import Card from "@/components/ui/Card";
import { testimonials } from "@/lib/constants";

export default function TestimonialsSection() {
  return (
    <section className="section testimonial-section motif">
      <div className="container">
        <SectionHeader title="What Our Guests Say" />
        <div className="quote-grid">
          {testimonials.map(([quote, guest], index) => (
            <AnimatedSection key={guest} delay={index * 0.1}>
              <Card className="quote-card">
                <p>“{quote}”</p>
                <span>★★★★★</span>
                <strong>{guest}</strong>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
