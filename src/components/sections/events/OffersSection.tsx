"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initGSAP } from "@/lib/gsap";
import SectionHeader from "@/components/shared/SectionHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useActiveOffers } from "@/hooks/useApi";
import { useConfig } from "@/hooks/useConfig";

export default function OffersSection() {
  initGSAP();
  const { config } = useConfig();
  const { data: offers = [] } = useActiveOffers();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.52, ease: "power3.out",
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
          gsap.to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.49, stagger: 0.1, ease: "power3.out" });
        },
      });

      const pcts = gridRef.current?.querySelectorAll(".offer-pct-anim") ?? [];
      gsap.fromTo(
        pcts,
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1, scale: 1, duration: 0.45, stagger: 0.11, ease: "back.out(1.4)",
          scrollTrigger: { trigger: gridRef.current, start: "top 78%", once: true },
        }
      );
    });

    return () => ctx.revert();
  }, [offers]);

  if (!config.showOffers || offers.length === 0) return null;

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
          {offers.map((offer) => (
            <div key={offer.id} className="offer-card-wrap" style={{ opacity: 0 }}>
              <Card className="offer-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <div className="offer-pct-anim" style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "4px",
                  marginBottom: "16px",
                }}>
                  <span className="offer-card-pct">{offer.pct}</span>
                  <span style={{
                    fontFamily: "var(--font-display), Georgia, serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "var(--muted)",
                    letterSpacing: "0.06em",
                  }}>{offer.unit}</span>
                </div>

                <div style={{
                  width: "40px",
                  height: "2px",
                  background: "linear-gradient(90deg, var(--primary), transparent)",
                  marginBottom: "16px",
                }} />

                <h3 style={{ fontSize: "22px", margin: "0 0 10px" }}>{offer.title}</h3>
                <p style={{ flex: 1, marginBottom: "16px", lineHeight: 1.65, fontSize: "14px" }}>{offer.description}</p>

                <div className="offer-validity" style={{ marginBottom: "20px" }}>
                  <span>🗓</span>
                  {offer.validity}
                </div>

                <Button href="/reservation" variant="ghost" style={{ fontSize: "12px", alignSelf: "flex-start" }}>
                  {offer.cta}
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
