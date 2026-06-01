import AnimatedSection from "@/components/shared/AnimatedSection";
import PageHero from "@/components/shared/PageHero";
import ContactDetails from "@/components/sections/contact/ContactDetails";
import ContactForm from "@/components/sections/contact/ContactForm";
import MapEmbed from "@/components/sections/contact/MapEmbed";

export default function ContactSection() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Contact Us" text="We'd love to hear from you" />
      <section className="section">
        <div className="container contact-layout">
          <AnimatedSection direction="left"><ContactDetails /></AnimatedSection>
          <AnimatedSection direction="right"><ContactForm /></AnimatedSection>
        </div>
      </section>
      <MapEmbed />
    </>
  );
}
