"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import PageHero from "@/components/shared/PageHero";
import SectionLabel from "@/components/ui/SectionLabel";
import { images } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  {
    year: "2018",
    title: "Founded",
    text: "Opened as a warm Nepali kitchen in As Sulaymaniyah, bringing Himalayan flavours to Iraq with love and authenticity.",
  },
  {
    year: "2020",
    title: "Bar Expansion",
    text: "Introduced a full premium bar program — curated cocktails, imported spirits, and craft beverages for long, golden evenings.",
  },
  {
    year: "2022",
    title: "Three Cuisines",
    text: "Expanded the kitchen to encompass Indian and Chinese cuisine alongside Nepali classics, creating a truly pan-Asian experience.",
  },
  {
    year: "2023",
    title: "Cultural Events",
    text: "Launched live folk music nights, Nepali New Year celebrations, and private dining events that honour our heritage.",
  },
];

export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
        defaults: { ease: "power3.out" },
      });

      /* Image */
      tl.fromTo(imgRef.current, { opacity: 0, x: -60, scale: 0.94 }, { opacity: 1, x: 0, scale: 1, duration: 0.65 })
        .fromTo(labelRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.42 }, "-=0.7")
        .fromTo(headingRef.current, { opacity: 0, y: 36, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55 }, "-=0.5")
        .fromTo(bodyRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45 }, "-=0.55");

      /* Timeline items stagger */
      const items = timelineRef.current?.querySelectorAll(".timeline-item") ?? [];
      gsap.set(items, { opacity: 0, x: 40 });

      ScrollTrigger.create({
        trigger: timelineRef.current,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(items, { opacity: 1, x: 0, duration: 0.42, stagger: 0.11, ease: "power3.out" });
        },
      });

      /* Timeline dot lines draw in */
      const lines = timelineRef.current?.querySelectorAll(".timeline-line") ?? [];
      gsap.set(lines, { scaleY: 0, transformOrigin: "top" });
      ScrollTrigger.create({
        trigger: timelineRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(lines, { scaleY: 1, duration: 0.45, stagger: 0.09, ease: "power2.out", delay: 0.2 });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <PageHero eyebrow="About" title="Our Story" text="A Himalayan journey that began in 2018" />

      <section className="section" id="story" ref={sectionRef}>
        <div className="container split-grid about-story">
          {/* Left: image */}
          <div ref={imgRef} style={{ opacity: 0, position: "relative" }}>
            <div style={{
              position: "relative",
              minHeight: "520px",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid rgba(242,202,80,0.20)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            }}>
              <Image
                src={images.dining}
                alt="Restaurant interior"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Gold inner frame */}
              <div style={{
                position: "absolute",
                inset: "16px",
                border: "1px solid rgba(242,202,80,0.15)",
                borderRadius: "8px",
                pointerEvents: "none",
                zIndex: 1,
              }} />
            </div>

            {/* Floating badge */}
            <div style={{
              position: "absolute",
              bottom: "-16px",
              right: "24px",
              padding: "16px 24px",
              background: "var(--surface)",
              border: "1px solid rgba(242,202,80,0.35)",
              borderRadius: "10px",
              backdropFilter: "blur(16px)",
              textAlign: "center",
            }}>
              <strong style={{
                display: "block",
                fontFamily: "var(--font-display), Georgia, serif",
                fontSize: "32px",
                fontWeight: 900,
                color: "var(--primary)",
                lineHeight: 1,
              }}>6+</strong>
              <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--muted)" }}>
                Years of Warmth
              </span>
            </div>
          </div>

          {/* Right: text + timeline */}
          <div className="story-copy">
            <div ref={labelRef} style={{ opacity: 0 }}>
              <SectionLabel>From the Mountains</SectionLabel>
            </div>
            <h2 ref={headingRef} style={{ opacity: 0 }}>
              From the Mountains<br />to Your Table
            </h2>
            <p ref={bodyRef} style={{ opacity: 0 }}>
              Nepali Restaurant & Bar began with a simple belief: a meal can carry
              home across borders. Our kitchen brings Nepali comfort, Indian depth,
              and Chinese wok-fired energy under one roof — served in a setting made
              for unhurried nights and generous tables. Every dish we craft honours
              the traditions of the Himalayan kitchen.
            </p>

            {/* Vertical timeline */}
            <div className="timeline-v" ref={timelineRef} style={{ marginTop: "32px" }}>
              {milestones.map(({ year, title, text }, i) => (
                <div className="timeline-item" key={year} style={{ opacity: 0 }}>
                  <div className="timeline-year">{year}</div>
                  <div className="timeline-dot-col">
                    <div className="timeline-dot" />
                    {i < milestones.length - 1 && <div className="timeline-line" />}
                  </div>
                  <div className="timeline-content">
                    <h3>{title}</h3>
                    <p style={{ fontSize: "14px" }}>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
