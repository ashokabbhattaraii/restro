import AnimatedSection from "@/components/shared/AnimatedSection";
import FoodImage from "@/components/shared/FoodImage";
import PageHero from "@/components/shared/PageHero";
import Card from "@/components/ui/Card";
import SectionLabel from "@/components/ui/SectionLabel";
import { images } from "@/lib/constants";

const milestones = [
  ["2018", "Founded", "Opened as a warm Nepali kitchen in Sulaymaniyah."],
  ["2020", "Bar Expansion", "Introduced a premium bar program for long evenings."],
  ["2023", "Cultural Events", "Launched music nights, celebrations, and private gatherings."],
];

export default function StorySection() {
  return (
    <>
      <PageHero eyebrow="About" title="Our Story" text="A Himalayan journey that began in 2018" />
      <section className="section">
        <div className="container split-grid about-story">
          <AnimatedSection direction="left">
            <FoodImage src={images.dining} alt="Restaurant interior" />
          </AnimatedSection>
          <AnimatedSection className="story-copy" direction="right">
            <SectionLabel>From the Mountains</SectionLabel>
            <h2>From the Mountains to Your Table</h2>
            <p>
              Nepali Restaurant & Bar began with a simple belief: a meal can carry
              home across borders. Our kitchen brings Nepali comfort, Indian depth,
              and Chinese wok-fired energy under one roof, served in a setting made
              for unhurried nights and generous tables.
            </p>
            <div className="timeline">
              {milestones.map(([year, title, text]) => (
                <Card key={year}>
                  <strong>{year}</strong>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Card>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
