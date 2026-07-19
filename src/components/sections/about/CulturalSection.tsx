"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const CULTURAL_PILLARS = [
  { icon: "🏔️", label: "Mountain Spirit", text: "The resilience and warmth of Himalayan communities" },
  { icon: "🤝", label: "Generous Hospitality", text: "Every guest treated as a returning family member" },
  { icon: "🌿", label: "Honest Ingredients", text: "Sourced with care, prepared with patient hands" },
];

export default function CulturalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Text column */
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1, x: 0, duration: 0.62, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
        }
      );

      /* Pillars stagger */
      const pillars = pillarsRef.current?.querySelectorAll(".cultural-pillar") ?? [];
      gsap.set(pillars, { opacity: 0, x: -30 });
      ScrollTrigger.create({
        trigger: pillarsRef.current,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(pillars, { opacity: 1, x: 0, duration: 0.36, stagger: 0.08, ease: "power2.out" });
        },
      });

      /* SVG art: draw in from opacity + scale */
      gsap.fromTo(
        artRef.current,
        { opacity: 0, x: 60, scale: 0.9 },
        {
          opacity: 1, x: 0, scale: 1, duration: 0.68, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
        }
      );

      /* Animate SVG lines floating */
      if (artRef.current) {
        gsap.to(artRef.current, {
          y: -10,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.8,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="section cultural-section" ref={sectionRef}>
      <div className="container split-grid">
        {/* Text */}
        <div ref={textRef} style={{ opacity: 0 }}>
          <SectionLabel>Inspired by Nepal</SectionLabel>
          <h2 style={{ margin: "16px 0 20px" }}>A Culture That Feeds the Soul</h2>
          <p style={{ marginBottom: "24px", lineHeight: 1.75 }}>
            Nepali hospitality is generous without being loud. It lives in the
            second serving, the warm tea, the care taken with guests who are far
            from home. Our dining room translates that feeling into charcoal,
            glass, gold, and food made with patient hands.
          </p>
          <p style={{ marginBottom: "32px", lineHeight: 1.75 }}>
            Nepal's cultural heritage — its mountain landscapes, festival colors,
            and communal dining traditions — shapes every corner of this restaurant.
            We carry those values proudly, thousands of kilometres from the Himalayas.
          </p>

          {/* Pillars */}
          <div ref={pillarsRef} style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "36px" }}>
            {CULTURAL_PILLARS.map(({ icon, label, text }) => (
              <div
                key={label}
                className="cultural-pillar"
                style={{ display: "flex", alignItems: "flex-start", gap: "14px", opacity: 0 }}
              >
                <span style={{ fontSize: "20px", marginTop: "2px" }} aria-hidden="true">{icon}</span>
                <div>
                  <strong style={{
                    display: "block",
                    fontFamily: "var(--font-display), Georgia, serif",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--primary)",
                    marginBottom: "2px",
                  }}>{label}</strong>
                  <span style={{ fontSize: "13px", color: "var(--muted)" }}>{text}</span>
                </div>
              </div>
            ))}
          </div>

          <Button href="/reservation">Reserve With Us</Button>
        </div>

        {/* Geometric Himalayan art panel */}
        <div
          ref={artRef}
          className="mountain-line-art"
          style={{ opacity: 0, position: "relative", overflow: "hidden" }}
        >
          {/* SVG Mountain silhouette */}
          <svg
            viewBox="0 0 480 360"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            aria-hidden="true"
          >
            {/* Diamond lattice */}
            <defs>
              <pattern id="diamond-lattice" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 0 L40 20 L20 40 L0 20 Z" stroke="rgba(242,202,80,0.08)" strokeWidth="0.8" fill="none" />
              </pattern>
            </defs>
            <rect width="480" height="360" fill="url(#diamond-lattice)" />

            {/* Mountain silhouette */}
            <path
              d="M0 280 L80 160 L140 200 L200 100 L260 180 L320 80 L380 160 L430 130 L480 200 L480 360 L0 360 Z"
              fill="rgba(242,202,80,0.04)"
              stroke="rgba(242,202,80,0.18)"
              strokeWidth="1.2"
            />

            {/* Snow cap highlights */}
            <path d="M200 100 L220 130 L240 110 L260 180" stroke="rgba(242,202,80,0.30)" strokeWidth="1" fill="none" />
            <path d="M320 80 L340 115 L360 95 L380 160" stroke="rgba(242,202,80,0.25)" strokeWidth="1" fill="none" />

            {/* Decorative circle */}
            <circle cx="240" cy="180" r="80" stroke="rgba(242,202,80,0.08)" strokeWidth="1" fill="none" />
            <circle cx="240" cy="180" r="50" stroke="rgba(242,202,80,0.06)" strokeWidth="1" fill="none" strokeDasharray="4 4" />

            {/* Gold star */}
            <path d="M240 140 L244 155 L260 155 L247 164 L251 180 L240 171 L229 180 L233 164 L220 155 L236 155 Z"
              fill="rgba(242,202,80,0.15)" stroke="rgba(242,202,80,0.40)" strokeWidth="0.8" />

            {/* Horizontal hairlines */}
            <line x1="40" y1="240" x2="440" y2="240" stroke="rgba(242,202,80,0.10)" strokeWidth="0.5" />
            <line x1="40" y1="270" x2="440" y2="270" stroke="rgba(242,202,80,0.07)" strokeWidth="0.5" />
            <line x1="40" y1="300" x2="440" y2="300" stroke="rgba(242,202,80,0.05)" strokeWidth="0.5" />
          </svg>

          {/* Nepal text watermark */}
          <div style={{
            position: "absolute",
            bottom: "24px",
            right: "24px",
            fontFamily: "var(--font-display), Georgia, serif",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase" as const,
            color: "rgba(242,202,80,0.25)",
          }}>
            Nepal · 2018
          </div>
        </div>
      </div>
    </section>
  );
}
