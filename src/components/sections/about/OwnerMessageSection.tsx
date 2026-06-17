"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { images } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export default function OwnerMessageSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(photoRef.current, { opacity: 0, scale: 0.82, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.0 })
        .fromTo(nameRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.65 }, "-=0.5")
        .fromTo(titleRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.4")
        .fromTo(barRef.current, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.7 }, "-=0.4")
        .fromTo(quoteRef.current, { opacity: 0, y: 32, filter: "blur(4px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 }, "-=0.5");

      /* Ambient photo glow pulse */
      gsap.to(photoRef.current, {
        boxShadow: "0 0 50px rgba(242,202,80,0.22), 0 0 100px rgba(242,202,80,0.08)",
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="section owner-section motif" ref={sectionRef}>
      <div className="container owner-card">
        {/* Owner photo */}
        <div
          ref={photoRef}
          className="owner-photo"
          style={{ opacity: 0, boxShadow: "0 0 30px rgba(242,202,80,0.10)" }}
        >
          <Image
            src={images.owner}
            alt="Founder portrait"
            fill
            style={{ objectFit: "cover" }}
            sizes="200px"
          />
        </div>

        <span className="owner-name" ref={nameRef} style={{ opacity: 0 }}>
          Sangita Family Kitchen
        </span>
        <p className="owner-title" ref={titleRef} style={{ opacity: 0 }}>
          Founder · Est. 2018
        </p>

        {/* Gold bar */}
        <div
          ref={barRef}
          style={{
            width: "60px",
            height: "3px",
            background: "linear-gradient(90deg, var(--primary), var(--gold-dark))",
            borderRadius: "2px",
            margin: "16px auto 24px",
            transform: "scaleX(0)",
          }}
        />

        <blockquote ref={quoteRef} style={{ opacity: 0 }}>
          Welcome to our family. Every dish we serve carries the heart of Nepal —
          the patience of slow spices, the comfort of shared rice, and the joy of
          seeing guests return again and again. When you dine with us, you are not
          just a customer; you are a guest in our home, and every plate is prepared
          with that intention.
        </blockquote>
      </div>
    </section>
  );
}
