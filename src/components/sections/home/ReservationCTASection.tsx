"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/Button";
import { restaurant } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export default function ReservationCTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Rings: orbit on scroll ── */
      gsap.to(ringRef.current, {
        rotate: 360,
        duration: 30,
        repeat: -1,
        ease: "none",
      });
      gsap.to(ring2Ref.current, {
        rotate: -360,
        duration: 22,
        repeat: -1,
        ease: "none",
      });

      /* ── Content reveal ── */
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(headingRef.current, { opacity: 0, y: 44, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.59 })
        .fromTo(textRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45 }, "-=0.5")
        .fromTo(btnRef.current, { opacity: 0, y: 20, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.42 }, "-=0.45")
        .fromTo(phoneRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.36 }, "-=0.35");
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="section reservation-band motif" ref={sectionRef} style={{ overflow: "hidden" }}>
      {/* Decorative orbiting rings */}
      <div
        ref={ringRef}
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          border: "1px solid rgba(242,202,80,0.08)",
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(45deg)",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      <div
        ref={ring2Ref}
        style={{
          position: "absolute",
          width: "380px",
          height: "380px",
          border: "1px solid rgba(242,202,80,0.06)",
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      <div className="container narrow-center" ref={contentRef} style={{ gap: "20px" }}>
        {/* Pre-heading label */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          border: "1px solid rgba(242,202,80,0.35)",
          borderRadius: "50px",
          padding: "8px 18px",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase" as const,
          color: "var(--primary)",
          background: "rgba(242,202,80,0.06)",
          marginBottom: "4px",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", display: "inline-block" }} />
          Reservations Open
        </div>

        <h2 ref={headingRef} style={{ opacity: 0, fontSize: "clamp(34px, 5vw, 60px)", lineHeight: 1.02 }}>
          Book Your Table Tonight
        </h2>
        <p ref={textRef} style={{ opacity: 0, maxWidth: "520px", fontSize: "17px" }}>
          Reservations available 7 days a week, 11 AM – 11 PM.
          Experience Himalayan warmth, refined service, and unforgettable flavours.
        </p>

        <div ref={btnRef} style={{ opacity: 0 }}>
          <Button href="/reservation">Make a Reservation</Button>
        </div>

        <div ref={phoneRef} style={{ opacity: 0, display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" as const, justifyContent: "center" }}>
          <span style={{ fontSize: "13px", color: "var(--muted)", letterSpacing: "0.06em" }}>Or call us directly:</span>
          <strong style={{ color: "var(--primary)", fontFamily: "var(--font-display), Georgia, serif", fontSize: "16px", letterSpacing: "0.04em" }}>
            📞 {restaurant.phoneOne} · {restaurant.phoneTwo}
          </strong>
        </div>
      </div>
    </section>
  );
}
