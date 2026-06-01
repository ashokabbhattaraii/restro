import AnimatedSection from "@/components/shared/AnimatedSection";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { images } from "@/lib/constants";

export default function OwnerMessageSection() {
  return (
    <section className="section owner-section motif">
      <AnimatedSection className="container owner-card">
        <div className="owner-photo">
          <OptimizedImage src={images.owner} alt="Owner portrait" />
        </div>
        <span className="owner-name">Sangita Family Kitchen</span>
        <p className="owner-title">Founder Message</p>
        <blockquote>
          Welcome to our family. Every dish we serve carries the heart of Nepal:
          the patience of slow spices, the comfort of shared rice, and the joy of
          seeing guests return.
        </blockquote>
      </AnimatedSection>
    </section>
  );
}
