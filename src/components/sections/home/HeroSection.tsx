"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Button from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";
import CounterUp from "@/components/shared/CounterUp";
import ParallaxImage from "@/components/shared/ParallaxImage";
import { images, restaurant } from "@/lib/constants";

const lines = ["A Taste of", "the Himalayas"];

export default function HeroSection() {
  const labelRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.fromTo(labelRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7 })
      .fromTo(
        linesRef.current.filter(Boolean),
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.15 },
        "-=0.4"
      )
      .fromTo(subtitleRef.current, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
      .fromTo(actionsRef.current, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4");

    return () => { tl.kill(); };
  }, []);

  return (
    <section className="home-hero motif">
      <ParallaxImage src={images.hero} alt="Moonlit luxury dining room" priority quality={90} />
      <div className="hero-grain" />
      <div className="hero-orbit" aria-hidden="true" />
      <div className="container hero-content">
        <div ref={labelRef} style={{ opacity: 0 }} className="flex flex-col items-center gap-6 select-none mb-2">
          <img src="/logo.png" alt={`${restaurant.name} Logo`} className="h-28 w-auto filter drop-shadow-[0_0_14px_rgba(230,195,98,0.4)] animate-pulse-slow rounded-full object-contain mb-2" />
          <SectionLabel>EST. {restaurant.established} · SULAYMANIYAH, IRAQ</SectionLabel>
        </div>
        <h1>
          {lines.map((line, index) => (
            <span
              key={line}
              ref={(el) => { linesRef.current[index] = el; }}
              style={{ opacity: 0 }}
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
      <div className="container hero-stats">
        <div className="stat-card">
          <strong>Est. <CounterUp value={2018} /></strong>
          <span>Founded</span>
        </div>
        <div className="stat-card">
          <strong><CounterUp value={3} /></strong>
          <span>Cuisines</span>
        </div>
        <div className="stat-card">
          <strong>Sulaymaniyah</strong>
          <span>Iraq</span>
        </div>
      </div>
    </section>
  );
}
