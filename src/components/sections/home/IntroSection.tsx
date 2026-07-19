"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FoodImage from "@/components/shared/FoodImage";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionLabel from "@/components/ui/SectionLabel";
import { images } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const HIGHLIGHTS = [
  { icon: "🏔️", label: "Himalayan Heritage", text: "Rooted in Nepali tradition since 2018" },
  { icon: "🍽️", label: "Three Cuisines", text: "Nepali, Chinese & Indian under one roof" },
  { icon: "🍹", label: "Premium Bar", text: "Craft cocktails & curated spirits" },
];

export default function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const sideLineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Left column: text stagger reveal ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(sideLineRef.current, { scaleY: 0, transformOrigin: "top" }, { scaleY: 1, duration: 0.45 })
        .fromTo(labelRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.42 }, "-=0.4")
        .fromTo(headingRef.current, { opacity: 0, y: 40, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.52 }, "-=0.4")
        .fromTo(bodyRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.42 }, "-=0.5")
        .fromTo(
          highlightsRef.current?.querySelectorAll(".intro-highlight") ?? [],
          { opacity: 0, x: -24, scale: 0.95 },
          { opacity: 1, x: 0, scale: 1, duration: 0.36, stagger: 0.08 },
          "-=0.4"
        )
        .fromTo(ctaRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.36 }, "-=0.3");

      /* ── Right column: images slide in with stagger ── */
      const imgTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      imgTl
        .fromTo(img1Ref.current, { opacity: 0, x: 60, scale: 0.92 }, { opacity: 1, x: 0, scale: 1, duration: 0.59 })
        .fromTo(img2Ref.current, { opacity: 0, x: 80, scale: 0.90, y: 20 }, { opacity: 1, x: 36, scale: 1, y: 0, duration: 0.59 }, "-=0.6");
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="section intro-section" ref={sectionRef}>
      <div className="container split-grid">
        {/* Left: text */}
        <Card className="story-card" style={{ position: "relative", overflow: "visible" }}>
          <span className="side-line" ref={sideLineRef} style={{ transform: "scaleY(0)", transformOrigin: "top" }} />
          <div ref={labelRef} style={{ opacity: 0 }}>
            <SectionLabel>Our Story</SectionLabel>
          </div>
          <h2 ref={headingRef} style={{ opacity: 0 }}>
            Where Himalayan Warmth Meets Refined Dining
          </h2>
          <p ref={bodyRef} style={{ opacity: 0 }}>
            Nestled in the heart of As Sulaymaniyah, Nepali Restaurant & Bar
            brings the rich flavors of Nepal, India, and China together in one
            extraordinary dining destination. Since 2018, we have been serving
            our guests authentic cuisine, crafted with tradition and love —
            every plate a story from the mountains.
          </p>

          <div ref={highlightsRef} style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "24px 0" }}>
            {HIGHLIGHTS.map(({ icon, label, text }) => (
              <div
                key={label}
                className="intro-highlight glass-panel"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 18px",
                  opacity: 0,
                }}
              >
                <span style={{ fontSize: "22px" }} aria-hidden="true">{icon}</span>
                <div>
                  <strong style={{
                    display: "block",
                    fontFamily: "var(--font-display), Georgia, serif",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--body)",
                    marginBottom: "2px",
                  }}>{label}</strong>
                  <span style={{ fontSize: "13px", color: "var(--muted)" }}>{text}</span>
                </div>
              </div>
            ))}
          </div>

          <div ref={ctaRef} style={{ opacity: 0 }}>
            <Button href="/about" variant="ghost">Our Full Story</Button>
          </div>
        </Card>

        {/* Right: images */}
        <div className="intro-images">
          <div ref={img1Ref} style={{ opacity: 0 }}>
            <FoodImage src={images.dining} alt="Luxury restaurant interior" />
          </div>
          <div ref={img2Ref} style={{ opacity: 0, transform: "translateX(36px)" }}>
            <FoodImage src={images.table} alt="Elegant table setting" />
          </div>
        </div>
      </div>
    </section>
  );
}
