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
    });

    return () => ctx.revert();
  }, [members]);

  if (!members.length) return null;

  return (
    <section className="section muted-band" id="team">
      <div className="container">
        <div ref={headerRef} style={{ opacity: 0 }}>
          <SectionHeader
            title="Our Team"
            text="The people behind our success — a multicultural team of 13 dedicated professionals."
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
                <h3>{member.role}</h3>
                <p style={{ marginTop: "8px", fontSize: "13px", lineHeight: 1.5 }}>{member.bio}</p>
                {member.department && (
                  <div className="team-dept-badge">
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
