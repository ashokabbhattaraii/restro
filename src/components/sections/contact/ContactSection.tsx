"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageHero from "@/components/shared/PageHero";
import ContactDetails from "@/components/sections/contact/ContactDetails";
import ContactForm from "@/components/sections/contact/ContactForm";
import MapEmbed from "@/components/sections/contact/MapEmbed";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const detailsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        detailsRef.current,
        { opacity: 0, x: -60, scale: 0.96 },
        {
          opacity: 1, x: 0, scale: 1, duration: 0.59, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );

      gsap.fromTo(
        formRef.current,
        { opacity: 0, x: 60, scale: 0.96 },
        {
          opacity: 1, x: 0, scale: 1, duration: 0.59, ease: "power3.out", delay: 0.14,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );

      /* Contact row items stagger */
      const rows = detailsRef.current?.querySelectorAll(".contact-row-item") ?? [];
      gsap.set(rows, { opacity: 0, x: -20 });
      ScrollTrigger.create({
        trigger: detailsRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(rows, { opacity: 1, x: 0, duration: 0.33, stagger: 0.06, ease: "power2.out", delay: 0.3 });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <PageHero eyebrow="Contact" title="Contact Us" text="We'd love to hear from you" />
      <section className="section" ref={sectionRef}>
        <div className="container contact-layout">
          <div ref={detailsRef} style={{ opacity: 0 }}>
            <ContactDetails />
          </div>
          <div ref={formRef} style={{ opacity: 0 }}>
            <ContactForm />
          </div>
        </div>
      </section>
      <MapEmbed />
    </>
  );
}
