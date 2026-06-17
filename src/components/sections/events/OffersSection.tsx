"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeader from "@/components/shared/SectionHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

gsap.registerPlugin(ScrollTrigger);

const offers = [
  {
    pct: "20%",
    unit: "OFF",
    title: "Happy Hour",
    desc: "Daily bar pours and selected snacks from 5–8 PM. Join us for the golden hour.",
    validity: "Valid Daily · 5:00 PM – 8:00 PM",
    cta: "Reserve a Spot",
  },
  {
    pct: "Set",
    unit: "Menu",
    title: "Weekend Family Set",
    desc: "A generous shared menu for four or more guests — the ideal weekend tradition.",
    validity: "Valid Sat & Sun",
    cta: "Book a Table",
  },
  {
    pct: "Free",
    unit: "Gift",
    title: "Birthday Special",
    desc: "Complimentary cake plating and Nepali chai for birthday tables. Let us celebrate you.",
    validity: "With advance booking",
    cta: "Book Now",
  },
];

export default function OffersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%", once: true },
        }
      );

      const cards = gridRef.current?.querySelectorAll(".offer-card-wrap") ?? [];
      gsap.set(cards, { opacity: 0, y: 60, scale: 0.92 });
      ScrollTrigger.create({
        trigger: gridRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.13, ease: "power3.out" });
        },
      });

      /* Animate pct numbers */
      const pcts = gridRef.current?.querySelectorAll(".offer-pct-anim") ?? [];
      gsap.fromTo(
        pcts,
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1, scale: 1, duration: 0.7, stagger: 0.15, ease: "back.out(1.4)",
          scrollTrigger: { trigger: gridRef.current, start: "top 78%", once: true },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="section offer-section motif" id="offers" ref={sectionRef}>
      <div className="container">
        <div ref={headerRef} style={{ opacity: 0 }}>
          <SectionHeader
            label="Current Offers"
            title="Special Offers"
            text="Exclusive deals and packages crafted to make every visit even more memorable."
          />
        </div>

        <div className="offer-grid" ref={gridRef}>
          {offers.map(({ pct, unit, title, desc, validity, cta }) => (
            <div key={title} className="offer-card-wrap" style={{ opacity: 0 }}>
              <Card className="offer-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                {/* Large percentage */}
                <div className="offer-pct-anim" style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "4px",
                  marginBottom: "16px",
                }}>
                  <span className="offer-card-pct">{pct}</span>
                  <span style={{
                    fontFamily: "var(--font-display), Georgia, serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "var(--muted)",
                    letterSpacing: "0.06em",
                  }}>{unit}</span>
                </div>

                {/* Gold divider */}
                <div style={{
                  width: "40px",
                  height: "2px",
                  background: "linear-gradient(90deg, var(--primary), transparent)",
                  marginBottom: "16px",
                }} />

                <h3 style={{ fontSize: "22px", margin: "0 0 10px" }}>{title}</h3>
                <p style={{ flex: 1, marginBottom: "16px", lineHeight: 1.65, fontSize: "14px" }}>{desc}</p>

                <div className="offer-validity" style={{ marginBottom: "20px" }}>
                  <span>🗓</span>
                  {validity}
                </div>

                <Button href="/reservation" variant="ghost" style={{ fontSize: "12px", alignSelf: "flex-start" }}>
                  {cta}
                </Button>
                <small style={{
                  display: "block",
                  marginTop: "14px",
                  fontSize: "11px",
                  color: "var(--muted)",
                  opacity: 0.7,
                }}>
                  Terms apply. Ask our team before ordering.
                </small>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
