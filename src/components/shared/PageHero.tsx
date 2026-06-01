import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";

export default function PageHero({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <header className="page-hero motif">
      <AnimatedSection className="container page-hero-inner">
        <p className="breadcrumb">Home &gt; {eyebrow}</p>
        <SectionLabel>{eyebrow}</SectionLabel>
        <h1>{title}</h1>
        <p>{text}</p>
      </AnimatedSection>
    </header>
  );
}
