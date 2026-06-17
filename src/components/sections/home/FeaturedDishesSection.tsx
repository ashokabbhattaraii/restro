"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useSWR from "swr";
import FoodImage from "@/components/shared/FoodImage";
import SectionHeader from "@/components/shared/SectionHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { fetcher } from "@/lib/utils";
import { menuItems } from "@/lib/constants";
import type { MenuItem } from "@/types";

gsap.registerPlugin(ScrollTrigger);

const STATIC_FEATURED = menuItems.filter((m) => m.featured).slice(0, 6);

export default function FeaturedDishesSection() {
  const { data = STATIC_FEATURED } = useSWR<MenuItem[]>("/api/menu?featured=true", fetcher);
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Header reveal ── */
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 36, filter: "blur(6px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85,
          scrollTrigger: { trigger: headerRef.current, start: "top 85%", once: true },
        }
      );

      /* ── Cards: stagger float-up with scale and subtle rotation ── */
      const grid = gridRef.current;
      if (!grid) return;

      const cards = grid.querySelectorAll<HTMLElement>(".dish-card-wrapper");
      gsap.set(cards, { opacity: 0, y: 80, scale: 0.92, rotateY: 8 });

      ScrollTrigger.create({
        trigger: grid,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateY: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
          });
        },
      });

      /* ── Hover tilt effect on each card ── */
      cards.forEach((card) => {
        const inner = card.querySelector(".dish-card");
        if (!inner) return;

        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(inner, {
            rotateX: -y * 6,
            rotateY: x * 6,
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 800,
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(inner, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.75)",
          });
        });
      });
    });

    return () => ctx.revert();
  }, [data]);

  const items = data.length > 0 ? data : STATIC_FEATURED;

  return (
    <section className="section" ref={sectionRef}>
      <div className="container">
        <div ref={headerRef} style={{ opacity: 0 }}>
          <SectionHeader
            label="Our Signatures"
            title="Crafted with Tradition"
            text="Six iconic dishes that tell the story of Nepal, India, and China — served with care at every table."
          />
        </div>

        <div className="dish-grid snap-row" ref={gridRef}>
          {items.map((dish) => (
            <div key={dish.id} className="dish-card-wrapper" style={{ perspective: "800px" }}>
              <Card className="dish-card">
                <FoodImage src={dish.image} alt={dish.name} />
                <div className="dish-body">
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                    <h3 style={{ margin: 0, flex: 1 }}>{dish.name}</h3>
                    <span style={{
                      fontFamily: "var(--font-display), Georgia, serif",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "var(--primary)",
                      whiteSpace: "nowrap",
                    }}>{dish.price}</span>
                  </div>
                  <p style={{ margin: "8px 0 12px", fontSize: "14px" }}>{dish.description}</p>
                  <div className="diet-row" style={{ marginBottom: "16px" }}>
                    {dish.dietary.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                  <div className="dish-footer">
                    <Button href="/menu" variant="ghost" style={{ fontSize: "12px", padding: "10px 18px" }}>
                      View Menu
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="center-actions" style={{ marginTop: "48px" }}>
          <Button href="/menu">View Full Menu</Button>
          <Button href="/reservation" variant="ghost">Reserve a Table</Button>
        </div>
      </div>
    </section>
  );
}
