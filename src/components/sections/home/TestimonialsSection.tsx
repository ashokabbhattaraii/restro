"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Star } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { ratingSummary, testimonials, type Testimonial } from "@/lib/constants";

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

function QuoteCard({ item }: { item: Testimonial }) {
  return (
    <figure className="quote-card">
      <span className="quote-mark" aria-hidden="true">&ldquo;</span>
      <Stars rating={item.rating} />
      <blockquote>{item.quote}</blockquote>
      <figcaption>
        <span className="quote-avatar" aria-hidden="true">{item.name.charAt(0)}</span>
        <span className="quote-meta">
          <strong>{item.name}</strong>
          <span>{item.location}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The track renders the list twice; animating to -50% loops seamlessly.
    const ctx = gsap.context(() => {
      tweenRef.current = gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration: 38,
        repeat: -1,
      });
    }, track);

    return () => ctx.revert();
  }, []);

  const pause = () => tweenRef.current?.pause();
  const resume = () => tweenRef.current?.resume();

  const loop = [...testimonials, ...testimonials];

  return (
    <section className="section testimonial-section motif">
      <div className="container">
        <SectionHeader
          label="Guest Reviews"
          title="What Our Guests Say"
          text="A few words from the tables we've had the pleasure of serving."
        />

        <div className="rating-summary">
          <strong className="rating-score">{ratingSummary.average.toFixed(1)}</strong>
          <div className="rating-summary-meta">
            <Stars rating={5} size={18} />
            <span>
              Rated <strong>{ratingSummary.average}/5</strong> by {ratingSummary.count}+ happy guests
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
            <QuoteCard key={`${item.name}-${index}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
