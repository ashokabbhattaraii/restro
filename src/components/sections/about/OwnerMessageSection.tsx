"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initGSAP } from "@/lib/gsap";
import Image from "next/image";
import { images } from "@/lib/constants";


export default function OwnerMessageSection() {
  initGSAP();
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

      tl.fromTo(photoRef.current, { opacity: 0, scale: 0.82, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.65 })
        .fromTo(nameRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.42 }, "-=0.5")
        .fromTo(titleRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.33 }, "-=0.4")
        .fromTo(barRef.current, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.45 }, "-=0.4")
        .fromTo(quoteRef.current, { opacity: 0, y: 32, filter: "blur(4px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.59 }, "-=0.5");

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
          Arjun Tamang
        </span>
        <p className="owner-title" ref={titleRef} style={{ opacity: 0 }}>
          Founder &amp; Owner
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
          Food connects cultures, and hospitality creates lasting memories. Every
          dish we serve carries the heart of Nepal to Iraq — built with patience,
          pride, and the joy of bringing people together around one table.
        </blockquote>
      </div>
    </section>
  );
}
