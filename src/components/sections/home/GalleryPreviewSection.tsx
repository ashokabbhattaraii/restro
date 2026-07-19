"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initGSAP } from "@/lib/gsap";
import FoodImage from "@/components/shared/FoodImage";
import SectionHeader from "@/components/shared/SectionHeader";
import Button from "@/components/ui/Button";
import { events, images, menuItems } from "@/lib/constants";


const previewImages = [
  { src: images.dining, label: "Dining Area" },
  { src: menuItems[1].image, label: "Food" },
  { src: images.bar, label: "Bar" },
  { src: images.table, label: "Interior" },
  { src: events[0].image, label: "Events" },
];

export default function GalleryPreviewSection() {
  initGSAP();
  const headerRef = useRef<HTMLDivElement>(null);
  const mosaicRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Header ── */
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.52, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%", once: true },
        }
      );

      /* ── Mosaic tiles: stagger with rotation ── */
      const mosaic = mosaicRef.current;
      if (!mosaic) return;
      const tiles = mosaic.querySelectorAll<HTMLElement>(".mosaic-tile");

      gsap.set(tiles, { opacity: 0, scale: 0.86, filter: "blur(4px)" });

      ScrollTrigger.create({
        trigger: mosaic,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(tiles, {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.49,
            stagger: { each: 0.1, from: "start" },
            ease: "power3.out",
          });
        },
      });

      /* ── CTA ── */
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.45, ease: "power2.out",
          scrollTrigger: { trigger: ctaRef.current, start: "top 90%", once: true },
        }
      );

      /* ── Hover parallax on each tile ── */
      tiles.forEach((tile) => {
        const img = tile.querySelector("img");
        if (!img) return;

        tile.addEventListener("mousemove", (e) => {
          const rect = tile.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
          const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
          gsap.to(img, { x, y, duration: 0.26, ease: "power2.out" });
        });

        tile.addEventListener("mouseleave", () => {
          gsap.to(img, { x: 0, y: 0, duration: 0.39, ease: "power2.out" });
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div ref={headerRef} style={{ opacity: 0 }}>
          <SectionHeader
            label="Gallery"
            title="A Glimpse Inside"
            text="From mountain-inspired interiors to gold-lit plates — a visual taste of the experience."
          />
        </div>

        <div className="mosaic-grid" ref={mosaicRef}>
          {previewImages.map(({ src, label }, index) => (
            <a
              className={`mosaic-tile tile-${index + 1}`}
              href="/gallery"
              key={src}
              aria-label={`View ${label} gallery`}
            >
              <FoodImage src={src} alt={`Restaurant ${label} gallery preview`} />
              <span>{label}</span>
            </a>
          ))}
        </div>

        <div className="center-actions" ref={ctaRef} style={{ opacity: 0, marginTop: "36px" }}>
          <Button href="/gallery" variant="ghost">Explore Full Gallery</Button>
        </div>
      </div>
    </section>
  );
}
