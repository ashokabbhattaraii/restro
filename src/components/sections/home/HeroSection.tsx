"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";
import CounterUp from "@/components/shared/CounterUp";
import ParallaxImage from "@/components/shared/ParallaxImage";
import { images, restaurant } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const lines = ["A Taste of", "the Himalayas"];

const STATS = [
  { value: 2018, label: "Founded", suffix: "" },
  { value: 3, label: "Cuisines", suffix: "+" },
  { value: 240, label: "Happy Guests", suffix: "+" },
];

export default function HeroSection() {
  const labelRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const ring3Ref = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Rings: stagger-scale in ── */
      gsap.fromTo(
        [ring1Ref.current, ring2Ref.current, ring3Ref.current],
        { scale: 0.4, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 2.2,
          stagger: 0.22,
          ease: "power4.out",
          delay: 0.1,
        }
      );

      /* ── Floating orbs ── */
      gsap.fromTo(
        [orb1Ref.current, orb2Ref.current],
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.6, stagger: 0.4, ease: "power3.out", delay: 0.3 }
      );

      /* ── Main content entrance ── */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.2 });

      tl.fromTo(labelRef.current, { opacity: 0, y: 32, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 })
        .fromTo(
          linesRef.current.filter(Boolean),
          { opacity: 0, y: 80, rotateX: -25 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1.1, stagger: 0.18, transformOrigin: "bottom center" },
          "-=0.5"
        )
        .fromTo(subtitleRef.current, { opacity: 0, y: 28, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75 }, "-=0.55")
        .fromTo(actionsRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.65 }, "-=0.45")
        .fromTo(hairlineRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.9, ease: "power2.out", transformOrigin: "left" }, "-=0.35")
        .fromTo(
          statsRef.current?.querySelectorAll(".stat-card") ?? [],
          { opacity: 0, y: 40, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.1 },
          "-=0.55"
        );

      /* ── Parallax depth on scroll ── */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        onUpdate: (self) => {
          const p = self.progress;
          if (ring1Ref.current) gsap.set(ring1Ref.current, { y: p * 80 });
          if (ring2Ref.current) gsap.set(ring2Ref.current, { y: p * 50 });
          if (ring3Ref.current) gsap.set(ring3Ref.current, { y: p * 30 });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="home-hero motif" ref={sectionRef} style={{ perspective: "1000px" }}>
      <ParallaxImage src={images.hero} alt="Moonlit luxury dining room" priority quality={90} />
      <div className="hero-grain" />

      {/* Decorative rings */}
      <div
        ref={ring1Ref}
        className="hero-ring"
        style={{
          width: "min(90vw, 900px)",
          aspectRatio: "1",
          borderWidth: "1px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(45deg)",
          opacity: 0,
        }}
        aria-hidden="true"
      />
      <div
        ref={ring2Ref}
        className="hero-ring"
        style={{
          width: "min(65vw, 650px)",
          aspectRatio: "1",
          borderWidth: "1px",
          borderColor: "rgba(242,202,80,0.05)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0,
        }}
        aria-hidden="true"
      />
      <div
        ref={ring3Ref}
        className="hero-ring"
        style={{
          width: "min(38vw, 380px)",
          aspectRatio: "1",
          borderWidth: "1px",
          borderColor: "rgba(242,202,80,0.07)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(22deg)",
          opacity: 0,
        }}
        aria-hidden="true"
      />

      {/* Ambient gold orbs */}
      <div
        ref={orb1Ref}
        style={{
          position: "absolute",
          top: "18%",
          right: "10%",
          width: "340px",
          height: "340px",
          background: "radial-gradient(circle, rgba(242,202,80,0.07) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
          opacity: 0,
          zIndex: 1,
        }}
        aria-hidden="true"
      />
      <div
        ref={orb2Ref}
        style={{
          position: "absolute",
          bottom: "22%",
          left: "8%",
          width: "260px",
          height: "260px",
          background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
          opacity: 0,
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      <div className="container hero-content">
        <div ref={labelRef} style={{ opacity: 0 }} className="flex flex-col items-center gap-6 select-none mb-2">
          <img
            src="/logo.png"
            alt={`${restaurant.name} Logo`}
            className="h-28 w-auto filter drop-shadow-[0_0_18px_rgba(242,202,80,0.45)] animate-pulse-slow rounded-full object-contain mb-2"
          />
          <SectionLabel>EST. {restaurant.established} · SULAYMANIYAH, IRAQ</SectionLabel>
        </div>

        <h1 style={{ perspective: "800px" }}>
          {lines.map((line, index) => (
            <span
              key={line}
              ref={(el) => { linesRef.current[index] = el; }}
              style={{ opacity: 0, display: "block" }}
            >
              {line}
            </span>
          ))}
        </h1>

        <p ref={subtitleRef} style={{ opacity: 0 }}>
          {restaurant.cuisine}
        </p>

        <div ref={actionsRef} className="hero-actions" style={{ opacity: 0 }}>
          <Button href="/reservation">Reserve a Table</Button>
          <Button href="/menu" variant="ghost">Explore Menu</Button>
        </div>
      </div>

      {/* Gold hairline + stats */}
      <div className="container" style={{ position: "relative", zIndex: 3, width: "100%" }}>
        <div
          ref={hairlineRef}
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(242,202,80,0.5), transparent)",
            marginBottom: "0",
            opacity: 0,
            transformOrigin: "left",
          }}
        />
      </div>

      <div className="container hero-stats" ref={statsRef}>
        {STATS.map(({ value, label, suffix }) => (
          <div className="stat-card" key={label}>
            <strong>
              <CounterUp value={value} />{suffix}
            </strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
