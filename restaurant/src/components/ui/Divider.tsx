import AnimatedSection from "@/components/shared/AnimatedSection";

export default function Divider() {
  return (
    <AnimatedSection className="divider-wrap" direction="fade">
      <div className="gold-divider" />
    </AnimatedSection>
  );
}
