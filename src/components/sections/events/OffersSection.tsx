import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import Card from "@/components/ui/Card";

const offers = [
  ["20% OFF", "Happy Hour", "Daily bar pours and selected snacks from 5-8 PM.", "Valid daily"],
  ["Family Set", "Weekend Family Set", "A generous shared menu for four or more guests.", "Valid weekends"],
  ["Cake + Chai", "Birthday Special", "Complimentary cake plating and Nepali chai for birthday tables.", "With booking"],
];

export default function OffersSection() {
  return (
    <section className="section offer-section motif">
      <div className="container">
        <SectionHeader label="Current Offers" title="Special Offers" />
        <div className="offer-grid">
          {offers.map(([amount, title, text, validity], index) => (
            <AnimatedSection key={title} delay={index * 0.08}>
              <Card className="offer-card">
                <strong>{amount}</strong>
                <h3>{title}</h3>
                <p>{text}</p>
                <span>{validity}</span>
                <small>Terms apply. Ask our team before ordering.</small>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
