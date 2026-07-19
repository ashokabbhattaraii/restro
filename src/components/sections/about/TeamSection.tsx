"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initGSAP } from "@/lib/gsap";
import Image from "next/image";
import SectionHeader from "@/components/shared/SectionHeader";
import Card from "@/components/ui/Card";
import { useStaff } from "@/hooks/useApi";


export default function TeamSection() {
  initGSAP();
  const { data: members = [] } = useStaff(true);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

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

      const cards = gridRef.current?.querySelectorAll(".team-card-wrap") ?? [];
      gsap.set(cards, { opacity: 0, y: 56, scale: 0.92 });

      ScrollTrigger.create({
        trigger: gridRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.09, ease: "power3.out" });
        },
      });

      (gridRef.current?.querySelectorAll(".team-photo") ?? []).forEach((photo) => {
        const el = photo as HTMLElement;
        el.addEventListener("mouseenter", () => {
          gsap.to(el, { boxShadow: "0 0 30px rgba(242,202,80,0.35)", duration: 0.23 });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(el, { boxShadow: "0 0 0 rgba(242,202,80,0)", duration: 0.29 });
        });
      });
    });

    return () => ctx.revert();
  }, [members]);

  return (
    <section className="section" id="team">
      <div className="container">
        <div ref={headerRef} style={{ opacity: 0 }}>
          <SectionHeader
            label="Meet Our Team"
            title="The People Behind the Experience"
            text="A dedicated team of chefs, bartenders, and hosts who bring the Himalayan spirit to every service."
          />
        </div>

        <div className="team-grid" ref={gridRef}>
          {members.map((member) => (
            <div key={member._id || member.id} className="team-card-wrap" style={{ opacity: 0 }}>
              <Card className="team-card">
                <div className="team-photo">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="120px"
                  />
                </div>
                <h3>{member.name}</h3>
                <span>{member.role}</span>
                <p style={{ marginTop: "10px", fontSize: "14px" }}>{member.bio}</p>
                {member.department && (
                  <div style={{
                    marginTop: "14px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    color: "var(--primary)",
                    border: "1px solid rgba(242,202,80,0.25)",
                    borderRadius: "4px",
                    padding: "4px 10px",
                  }}>
                    {member.department}
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
