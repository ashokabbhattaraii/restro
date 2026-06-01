import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import { cn } from "@/lib/utils";

export default function SectionHeader({
  label,
  title,
  text,
  align = "center",
}: {
  label?: string;
  title: string;
  text?: string;
  align?: "center" | "left";
}) {
  return (
    <AnimatedSection className={cn("section-header", align === "left" && "section-header-left")}>
      {label ? <SectionLabel>{label}</SectionLabel> : null}
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </AnimatedSection>
  );
}
