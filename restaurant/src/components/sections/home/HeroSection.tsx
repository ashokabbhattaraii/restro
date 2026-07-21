"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initGSAP } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import CounterUp from "@/components/shared/CounterUp";
import { images, restaurant } from "@/lib/constants";
import { useConfig } from "@/hooks/useConfig";


const lines = ["A Taste of", "the Himalayas"];

const STATS = [
  { value: 2018, label: "Founded", suffix: "" },
  { value: 3, label: "Cuisines", suffix: "+" },
  { value: 240, label: "Happy Guests", suffix: "+" },
];

const SLIDE_IMAGES = [
  "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=2200&q=90",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=2200&q=90",
  "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=2200&q=90",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=2200&q=90",
  "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=2200&q=90",
];

export default function HeroSection() {
  initGSAP();
  const { config } = useConfig();
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
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Background slideshow ── */
      const slides = slidesRef.current.filter(Boolean) as HTMLDivElement[];
      if (slides.length > 1) {
        gsap.set(slides.slice(1), { autoAlpha: 0 });
        const slideTl = gsap.timeline({ repeat: -1, paused: false });
        slides.forEach((slide, i) => {
          if (i === 0) return;
          slideTl
            .to(slides[i - 1], { autoAlpha: 0, duration: 1.2, ease: "power2.inOut" }, `>${5}`)
            .to(slide, { autoAlpha: 1, duration: 1.2, ease: "power2.inOut" }, "<");
        });
        slideTl.to(slides[slides.length - 1], { autoAlpha: 0, duration: 1.2, ease: "power2.inOut" }, `>${5}`);
        slideTl.to(slides[0], { autoAlpha: 1, duration: 1.2, ease: "power2.inOut" }, "<");
      }

      /* ── Rings: stagger-scale in ── */
      gsap.fromTo(
        [ring1Ref.current, ring2Ref.current, ring3Ref.current],
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.43, stagger: 0.17, ease: "power4.out", delay: 0.1 }
      );

      /* ── Floating orbs ── */
      gsap.fromTo(
        [orb1Ref.current, orb2Ref.current],
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.68, stagger: 0.3, ease: "power3.out", delay: 0.3 }
      );

      /* ── Main content entrance ── */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.2 });
      tl.fromTo(labelRef.current, { opacity: 0, y: 32, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.52 })
        .fromTo(
          linesRef.current.filter(Boolean),
          { opacity: 0, y: 80, rotateX: -25 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.72, stagger: 0.14, transformOrigin: "bottom center" },
          "-=0.5"
        )
        .fromTo(subtitleRef.current, { opacity: 0, y: 28, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.49 }, "-=0.55")
        .fromTo(actionsRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.42 }, "-=0.45")
        .fromTo(hairlineRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.59, ease: "power2.out", transformOrigin: "left" }, "-=0.35")
        .fromTo(
          statsRef.current?.querySelectorAll(".stat-card") ?? [],
          { opacity: 0, y: 40, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.42, stagger: 0.08 },
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
      {/* Slideshow background */}
      <div className="hero-slideshow" aria-hidden="true">
        {SLIDE_IMAGES.map((src, i) => (
          <div
            key={src}
            ref={(el) => { slidesRef.current[i] = el; }}
            className="hero-slide"
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
      <div className="hero-grain" />

      {/* Decorative rings */}
      <div
        ref={ring1Ref}
        className="hero-ring"
        style={{
          width: "min(90vw, 900px)", aspectRatio: "1", borderWidth: "1px",
          top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(45deg)", opacity: 0,
        }}
        aria-hidden="true"
      />
      <div
        ref={ring2Ref}
        className="hero-ring"
        style={{
          width: "min(65vw, 650px)", aspectRatio: "1", borderWidth: "1px",
          borderColor: "rgba(242,202,80,0.05)", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", opacity: 0,
        }}
        aria-hidden="true"
      />
      <div
        ref={ring3Ref}
        className="hero-ring"
        style={{
          width: "min(38vw, 380px)", aspectRatio: "1", borderWidth: "1px",
          borderColor: "rgba(242,202,80,0.07)", top: "50%", left: "50%",
          transform: "translate(-50%, -50%) rotate(22deg)", opacity: 0,
        }}
        aria-hidden="true"
      />

      {/* Ambient gold orbs */}
      <div
        ref={orb1Ref}
        style={{
          position: "absolute", top: "18%", right: "10%", width: "340px", height: "340px",
          background: "radial-gradient(circle, rgba(242,202,80,0.10) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none", opacity: 0, zIndex: 1,
        }}
        aria-hidden="true"
      />
      <div
        ref={orb2Ref}
        style={{
          position: "absolute", bottom: "22%", left: "8%", width: "260px", height: "260px",
          background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none", opacity: 0, zIndex: 1,
        }}
        aria-hidden="true"
      />

      <div className="container hero-content">
        <div ref={labelRef} style={{ opacity: 0 }} className="flex flex-col items-center gap-6 select-none mb-2">
          <span className="hero-logo-badge animate-pulse-slow mb-2">
            <img
              src="/logo.png"
              alt={`${restaurant.name} Logo`}
              className="h-24 w-auto object-contain"
            />
          </span>
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
            marginBottom: "0", opacity: 0, transformOrigin: "left",
          }}
        />
      </div>

      <div className="container hero-stats" ref={statsRef}>
        {STATS.map(({ value, label, suffix }) => (
          <div className="stat-card" key={label}>
            <strong><CounterUp value={value} />{suffix}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
