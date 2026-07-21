"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { initGSAP } from "@/lib/gsap";
import { Star } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { useVerifiedFeedback } from "@/hooks/useApi";
import type { VerifiedFeedback } from "@/types";
import type { Testimonial } from "@/lib/constants";

function Stars({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(rating) ? "star-on" : "star-off"}
          fill={i < Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

function QuoteCard({ item }: { item: Testimonial & { verified?: boolean } }) {
  return (
    <figure className="quote-card">
      <span className="quote-mark" aria-hidden="true">&ldquo;</span>
      <Stars rating={item.rating} />
      <blockquote>{item.quote}</blockquote>
      <figcaption>
        <span className="quote-avatar" aria-hidden="true">{item.name.charAt(0)}</span>
        <span className="quote-meta">
          <strong>{item.name}</strong>
          <span>{item.location || "Guest"}</span>
          {item.verified && <span className="verified-badge" style={{ color: "#27ae60", fontSize: "11px", marginLeft: 8 }}>✓ Verified</span>}
        </span>
      </figcaption>
    </figure>
  );
}

function calculateRatingSummary(feedback: VerifiedFeedback[]): { average: number; count: number } {
  const valid = feedback.filter((f) => Number.isFinite(f.rating) && f.rating > 0);
  if (valid.length === 0) return { average: 0, count: 0 };
  const sum = valid.reduce((acc, f) => acc + f.rating, 0);
  return { average: sum / valid.length, count: valid.length };
}

export default function TestimonialsSection() {
  initGSAP();
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const { data: verifiedFeedback = [], isLoading } = useVerifiedFeedback();

  // Derived value — no state/effect needed. API verified feedback first, then
  // the curated testimonials. Recomputed only when the query data changes.
  const displayFeedback = useMemo<Testimonial[]>(() => {
    return verifiedFeedback.map((f) => ({
      quote: f.quote,
      name: f.name,
      location: f.location || "Guest",
      rating: f.rating,
      verified: true,
    }));
  }, [verifiedFeedback]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || displayFeedback.length === 0) return;

    // The track renders the list twice, so animating to -50% shifts by exactly
    // one full set — the wrap point is visually identical → seamless infinite loop.
    // Duration scales with the number of cards for a consistent scroll speed.
    // Under "reduce motion" we slow it down rather than stop, so the marquee
    // still communicates that these cards scroll.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const secondsPerCard = reduceMotion ? 11 : 6;

    const ctx = gsap.context(() => {
      gsap.set(track, { xPercent: 0 });
      tweenRef.current = gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration: Math.max(24, displayFeedback.length * secondsPerCard),
        repeat: -1,
      });
    }, track);

    return () => ctx.revert();
  }, [displayFeedback]);

  const pause = () => tweenRef.current?.pause();
  const resume = () => tweenRef.current?.resume();

  // Calculate rating summary from verified feedback
  const ratingSummary = calculateRatingSummary(verifiedFeedback);

  const loop = [...displayFeedback, ...displayFeedback];

  if (isLoading && displayFeedback.length === 0) {
    return (
      <section className="section testimonial-section motif">
        <div className="container" style={{ textAlign: "center", padding: 48 }}>
          <div style={{ color: "var(--primary)" }} className="animate-spin">⟳</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section testimonial-section motif">
      <div className="container">
        <SectionHeader
          title="What Our Guests Say"
          text="A few words from the tables we've had the pleasure of serving."
        />

        <div className="rating-summary">
          <strong className="rating-score">{ratingSummary.average.toFixed(1)}</strong>
          <div className="rating-summary-meta">
            <Stars rating={5} size={18} />
            <span>
              {ratingSummary.count > 0
                ? `Rated ${ratingSummary.average.toFixed(1)}/5 by ${ratingSummary.count}+ happy guests`
                : "Be the first to leave a review"}
            </span>
          </div>
        </div>
      </div>

      <div
        className="testimonial-marquee"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        <div className="testimonial-track" ref={trackRef}>
          {loop.map((item, index) => (
            <QuoteCard key={`${item.name}-${index}-${item.verified ? "v" : "h"}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}