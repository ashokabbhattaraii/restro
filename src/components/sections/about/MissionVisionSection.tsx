import AnimatedSection from "@/components/shared/AnimatedSection";
import Card from "@/components/ui/Card";

const cards = [
  ["◆", "Our Mission", "To serve honest Himalayan hospitality through memorable food, refined service, and a room where every guest feels expected."],
  ["◇", "Our Vision", "To become Sulaymaniyah's most distinctive destination for Nepali culture, premium dining, and celebratory evenings."],
];

export default function MissionVisionSection() {
  return (
    <section className="section muted-band" id="mission">
      <div className="container mission-grid">
        {cards.map(([icon, title, text], index) => (
          <AnimatedSection key={title} delay={index * 0.1}>
            <Card className="mission-card">
              <span>{icon}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
