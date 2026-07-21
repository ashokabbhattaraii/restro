import AnimatedSection from "@/components/shared/AnimatedSection";
import { cn } from "@/lib/utils";

export default function SectionHeader({
  title,
  text,
  align = "center",
}: {
  title: string;
  text?: string;
  align?: "center" | "left";
}) {
  return (
    <AnimatedSection className={cn("section-header", align === "left" && "section-header-left")}>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </AnimatedSection>
  );
}
