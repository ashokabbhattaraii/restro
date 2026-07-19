"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, initGSAP } from "@/lib/gsap";
import Card from "@/components/ui/Card";


const cards = [
  {
    icon: "◆",
    accent: "#f2ca50",
    title: "Our Mission",
    text: "To serve honest Himalayan hospitality through memorable food, refined service, and a room where every guest feels expected. We believe that great cuisine transcends borders — each dish is an act of care.",
    points: ["Authentic recipes", "Premium ingredients", "Warm, personal service"],
  },
  {
    icon: "◇",
    accent: "#d4af37",
    title: "Our Vision",
    text: "To become Sulaymaniyah's most distinctive destination for Nepali culture, premium dining, and celebratory evenings — a place where every night feels like a special occasion.",
    points: ["Cultural excellence", "Memorable experiences", "Community & celebration"],
  },
];

export default function MissionVisionSection() {
  initGSAP();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.94, rotateY: i === 0 ? 8 : -8 },
          {
            opacity: 1, y: 0, scale: 1, rotateY: 0,
            duration: 0.59, delay: i * 0.15, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 82%", once: true },
          }
        );

        /* Points stagger */
        const points = card.querySelectorAll(".mission-point");
        gsap.set(points, { opacity: 0, x: -20 });
        ScrollTrigger.create({
          trigger: card,
          start: "top 78%",
          once: true,
          onEnter: () => {
            gsap.to(points, { opacity: 1, x: 0, duration: 0.33, stagger: 0.08, delay: 0.4 + i * 0.15 });
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="section muted-band" id="mission">
      <div className="container mission-grid">
        {cards.map(({ icon, accent, title, text, points }, index) => (
          <div
            key={title}
            ref={(el) => { cardsRef.current[index] = el; }}
            style={{ opacity: 0, perspective: "800px" }}
          >
            <Card className="mission-card" style={{ height: "100%" }}>
              {/* Icon */}
              <div style={{
                width: "56px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                color: accent,
                border: `1px solid ${accent}40`,
                borderRadius: "50%",
                background: `${accent}0d`,
                marginBottom: "24px",
              }}>
                {icon}
              </div>

              {/* Accent line */}
              <div style={{
                width: "40px",
                height: "3px",
                background: `linear-gradient(90deg, ${accent}, transparent)`,
                borderRadius: "2px",
                marginBottom: "16px",
              }} />

              <h2 style={{ fontSize: "28px", margin: "0 0 14px" }}>{title}</h2>
              <p style={{ marginBottom: "24px", lineHeight: 1.7 }}>{text}</p>

              {/* Key points */}
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {points.map((pt) => (
                  <li key={pt} className="mission-point" style={{ display: "flex", alignItems: "center", gap: "10px", opacity: 0 }}>
                    <span style={{ color: accent, fontSize: "16px", lineHeight: 1 }}>✦</span>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--body)" }}>{pt}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
