"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initGSAP } from "@/lib/gsap";
import Image from "next/image";
import PageHero from "@/components/shared/PageHero";
import type { BreadcrumbItem } from "@/components/shared/PageHero";
import SectionHeader from "@/components/shared/SectionHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { images } from "@/lib/constants";

const FRAME = {
  position: "relative" as const,
  borderRadius: "var(--radius-card)",
  overflow: "hidden",
  border: "1px solid var(--card-border)",
  boxShadow: "var(--shadow)",
} satisfies React.CSSProperties;

const INNER_FRAME = {
  position: "absolute" as const,
  inset: "16px",
  border: "1px solid var(--card-border)",
  borderRadius: "8px",
  pointerEvents: "none",
  zIndex: 1,
} satisfies React.CSSProperties;

const FLOATING_BADGE = {
  background: "var(--surface)",
  border: "1px solid var(--card-border-strong)",
  borderRadius: "var(--radius-card)",
  backdropFilter: "blur(16px)",
  textAlign: "center" as const,
} satisfies React.CSSProperties;

const BADGE_NUM = {
  display: "block" as const,
  fontFamily: "var(--font-display), Georgia, serif",
  fontSize: "32px",
  fontWeight: 900,
  color: "var(--primary)",
  lineHeight: 1,
} satisfies React.CSSProperties;

const BADGE_LABEL = {
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "var(--muted)",
} satisfies React.CSSProperties;

const BODY_PARAGRAPH = {
  marginBottom: "18px",
  lineHeight: 1.75,
} satisfies React.CSSProperties;

const GOLD_BAR = {
  width: "60px",
  height: "3px",
  background: "linear-gradient(90deg, var(--primary), var(--gold-dark))",
  borderRadius: "2px",
  margin: "16px auto 24px",
} satisfies React.CSSProperties;

const QUOTE_STYLE = {
  maxWidth: 720,
  margin: "0 auto 36px",
  borderLeft: "3px solid var(--primary)",
  paddingLeft: "24px",
  color: "var(--muted)",
  fontFamily: "var(--font-display), serif",
  fontSize: "clamp(24px, 3.4vw, 32px)",
  fontStyle: "italic",
  lineHeight: 1.35,
  textAlign: "left" as const,
} satisfies React.CSSProperties;

const LANGUAGES = [
  { name: "Arabic", note: "Local communication" },
  { name: "Kurdish", note: "Community & suppliers" },
  { name: "English", note: "Guests & partners" },
  { name: "Basic Chinese", note: "Kitchen & suppliers" },
];

const TEAM_BREAKDOWN = [
  { count: 8, label: "Kitchen Staff" },
  { count: 2, label: "Nepali Chefs (Asian Cuisine)" },
  { count: 1, label: "Hookah Specialist (Syrian)" },
  { count: 2, label: "Interpreters" },
];

const JOURNEY_MILESTONES = [
  { year: "2013", title: "Arrived in Iraq", text: "Left Nuwakot, Nepal to build a new life and share Nepali cuisine in Sulaymaniyah." },
  { year: "2018", title: "Restaurant Founded", text: "Opened Nepali Restaurant & Bar, bringing Himalayan hospitality to an international audience." },
  { year: "2023", title: "Multicultural Team", text: "Grew to 13 employees from multiple nationalities, expanding to 4 cuisines with a full bar and entertainment." },
];

const FAVORITES = [
  "Momo", "Chowmein", "Noodles", "Samosa", "Roti", "Curry", "Ramen", "Traditional Meal Sets"
];

function ImageFrame({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div style={{ ...FRAME }} className={className}>
      <Image src={src} alt={alt} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
      <div style={INNER_FRAME} />
    </div>
  );
}

function FloatingBadge({ number, label, className }: { number: string; label: string; className?: string }) {
  return (
    <div style={FLOATING_BADGE} className={className}>
      <strong style={BADGE_NUM}>{number}</strong>
      <span style={BADGE_LABEL}>{label}</span>
    </div>
  );
}

export default function FounderStory() {
  initGSAP();

  const introRef = useRef<HTMLElement>(null);
  const langRef = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLElement>(null);
  const milestoneRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const favoritesRef = useRef<HTMLElement>(null);
  const hoursRef = useRef<HTMLElement>(null);
  const closingRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const introMedia = introRef.current?.querySelector(".founder-media-col") ?? null;
      const introCopy = introRef.current?.querySelector(".founder-copy-col") ?? null;
      const introTl = gsap.timeline({
        scrollTrigger: { trigger: introRef.current, start: "top 75%", once: true },
        defaults: { ease: "power3.out" },
      });
      introTl
        .fromTo(introMedia, { opacity: 0, x: -60, scale: 0.94 }, { opacity: 1, x: 0, scale: 1, duration: 0.65 })
        .fromTo(introCopy, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.55 }, "-=0.6");

      const langCards = langRef.current?.querySelectorAll(".founder-lang") ?? [];
      gsap.set(langCards, { opacity: 0, y: 44, scale: 0.92 });
      ScrollTrigger.create({
        trigger: langRef.current,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(langCards, { opacity: 1, y: 0, scale: 1, duration: 0.44, stagger: 0.09, ease: "power3.out" });
        },
      });

      const jCopy = journeyRef.current?.querySelector(".founder-journey-copy") ?? null;
      const jMedia = journeyRef.current?.querySelector(".founder-journey-media") ?? null;
      const journeyTl = gsap.timeline({
        scrollTrigger: { trigger: journeyRef.current, start: "top 78%", once: true },
        defaults: { ease: "power3.out" },
      });
      journeyTl
        .fromTo(jCopy, { opacity: 0, x: -50, filter: "blur(4px)" }, { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.58 })
        .fromTo(jMedia, { opacity: 0, x: 60, scale: 0.94 }, { opacity: 1, x: 0, scale: 1, duration: 0.62 }, "-=0.6");

      const milestones = milestoneRef.current?.querySelectorAll(".founder-milestone") ?? [];
      gsap.set(milestones, { opacity: 0, y: 50 });
      ScrollTrigger.create({
        trigger: milestoneRef.current,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(milestones, { opacity: 1, y: 0, duration: 0.42, stagger: 0.12, ease: "power3.out" });
        },
      });

      const teamCards = teamRef.current?.querySelectorAll(".founder-team-item") ?? [];
      gsap.set(teamCards, { opacity: 0, y: 56, scale: 0.9 });
      ScrollTrigger.create({
        trigger: teamRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(teamCards, { opacity: 1, y: 0, scale: 1, duration: 0.48, stagger: 0.1, ease: "power3.out" });
        },
      });

      const favorites = favoritesRef.current?.querySelectorAll(".founder-favorite") ?? [];
      gsap.set(favorites, { opacity: 0, y: 24, scale: 0.92 });
      ScrollTrigger.create({
        trigger: favoritesRef.current,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(favorites, { opacity: 1, y: 0, scale: 1, duration: 0.36, stagger: 0.06, ease: "power3.out" });
        },
      });

      const hoursContainer = hoursRef.current;
      if (hoursContainer) {
        gsap.set(hoursContainer, { opacity: 0, y: 30 });
        ScrollTrigger.create({
          trigger: hoursRef.current,
          start: "top 82%",
          once: true,
          onEnter: () => {
            gsap.to(hoursContainer, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
          },
        });
      }

      const finalHeading = closingRef.current?.querySelector(".founder-final-heading") ?? null;
      const finalBody = closingRef.current?.querySelector(".founder-final-body") ?? null;
      const finalQuote = closingRef.current?.querySelector(".founder-final-quote") ?? null;
      const finalCta = closingRef.current?.querySelector(".founder-final-cta") ?? null;
      const closingTl = gsap.timeline({
        scrollTrigger: { trigger: closingRef.current, start: "top 78%", once: true },
        defaults: { ease: "power3.out" },
      });
      closingTl
        .fromTo(finalHeading, { opacity: 0, y: 40, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55 })
        .fromTo(finalBody, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.5")
        .fromTo(barRef.current, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.45 }, "-=0.4")
        .fromTo(finalQuote, { opacity: 0, y: 32, filter: "blur(4px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55 }, "-=0.5")
        .fromTo(finalCta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35 }, "-=0.35");
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Founder"
        title="Arjun Tamang"
        text="Bringing Nepali flavors to Iraq — a story of courage, dedication, and entrepreneurship."
        path={[{ label: "About", href: "/about" }, { label: "Founder", href: "/founder" }]}
      />

      {/* ═══════════ INTRO: About Arjun ═══════════ */}
      <section className="section founder-intro motif" ref={introRef}>
        <div className="container split-grid">
          <div className="founder-media-col" style={{ position: "relative", opacity: 0 }}>
            <ImageFrame src={images.owner} alt="Arjun Tamang — Founder of Nepali Restaurant & Bar" className="founder-img-main" />
            <FloatingBadge number="Since 2013" label="In Iraq" className="founder-badge" />
          </div>

          <div className="founder-copy-col" style={{ opacity: 0 }}>
            <h2 style={{ fontSize: "clamp(34px, 4vw, 52px)", lineHeight: 1.05, margin: "0 0 18px" }}>
              A Taste of Nepal, Far From Home
            </h2>
            <p style={BODY_PARAGRAPH}>
              Born in Belkotgadhi Municipality, Nuwakot, Nepal, Arjun Tamang is the
              founder and owner of Nepali Restaurant &amp; Bar in Sulaymaniyah, Iraq.
              His journey is a story of courage, dedication, and entrepreneurship — as
              he successfully introduced authentic Nepali hospitality and Asian cuisine
              to an international community.
            </p>
            <p style={BODY_PARAGRAPH}>
              Arjun moved to Iraq in 2013 with a dream of building a successful
              business and sharing the taste of Nepal with people from different
              cultures. Today, his restaurant has become a popular destination
              offering a wide variety of cuisines — including Nepali, Indian,
              Chinese, and Japanese dishes — along with a selection of beverages.
            </p>
            <p style={BODY_PARAGRAPH}>
              The restaurant serves a diverse menu featuring both vegetarian and
              non-vegetarian options, with dishes such as Momo, Chowmein, noodles,
              samosa, roti, curry, ramen, and traditional meal sets — all prepared
              with authentic flavors and quality.
            </p>
            <div className="founder-intro-cta" style={{ marginTop: "32px" }}>
              <Button href="/reservation">Reserve a Table</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ LANGUAGES ═══════════ */}
      <section className="section muted-band" ref={langRef}>
        <div className="container">
          <SectionHeader
            title="Speaking Every Guest&apos;s Language"
            text="His ability to communicate in multiple languages has helped him build strong relationships with customers, employees, and the local community."
          />
          <div className="founder-langs">
            {LANGUAGES.map(({ name, note }) => (
              <div key={name} className="founder-lang" style={{ opacity: 0 }}>
                <Card style={{ height: "100%", padding: "32px 24px", textAlign: "center" }}>
                  <h3 style={{ fontSize: "26px", margin: "0 0 6px", color: "var(--primary)" }}>{name}</h3>
                  <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)" }}>{note}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ JOURNEY ═══════════ */}
      <section className="section founder-journey" ref={journeyRef}>
        <div className="container split-grid">
          <div className="founder-journey-copy" style={{ opacity: 0 }}>
            <h2 style={{ fontSize: "clamp(34px, 4vw, 52px)", margin: "0 0 18px" }}>
              A Journey of Determination and Success
            </h2>
            <p style={BODY_PARAGRAPH}>
              Starting a business in a foreign country came with many challenges, but
              Arjun overcame them through hard work and commitment. Although traveling
              to Iraq from Nepal involved difficulties due to government restrictions at
              that time, Arjun established himself as a legal entrepreneur by obtaining
              the required business licenses and approvals from the Iraqi government.
            </p>
            <p style={BODY_PARAGRAPH}>
              According to Arjun, running a business in Iraq provides a supportive
              environment. He appreciates the trust and respect of local customers and
              the smooth business culture, where issues such as unpaid bills and
              customer disputes are uncommon.
            </p>
            <p style={{ lineHeight: 1.75 }}>
              Through Nepali Restaurant &amp; Bar, he continues to connect people from
              different backgrounds through food, service, and memorable dining
              experiences.
            </p>
          </div>

          <div className="founder-journey-media" style={{ position: "relative", opacity: 0 }}>
            <ImageFrame src={images.dining} alt="Restaurant interior in Sulaymaniyah, Iraq" className="founder-img-journey" />
          </div>
        </div>

        <div className="container" ref={milestoneRef} style={{ marginTop: "48px" }}>
          <div className="founder-milestones">
            {JOURNEY_MILESTONES.map(({ year, title, text }) => (
              <div key={year} className="founder-milestone" style={{ opacity: 0 }}>
                <div className="founder-milestone-year">{year}</div>
                <div className="founder-milestone-body">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TEAM ═══════════ */}
      <section className="section muted-band" ref={teamRef}>
        <div className="container">
          <SectionHeader
            title="Building a Multicultural Team"
            text="A diverse team of 13 employees across multiple nationalities powers the restaurant daily, creating a multicultural workplace environment."
          />
          <div className="founder-team">
            {TEAM_BREAKDOWN.map(({ count, label }) => (
              <div key={label} className="founder-team-item" style={{ opacity: 0 }}>
                <Card style={{ height: "100%", padding: "28px 24px", textAlign: "center" }}>
                  <strong style={{
                    display: "block",
                    fontFamily: "var(--font-display), Georgia, serif",
                    fontSize: "40px",
                    fontWeight: 900,
                    color: "var(--primary)",
                    lineHeight: 1,
                    marginBottom: "10px",
                  }}>
                    {count}
                  </strong>
                  <span style={{ fontSize: "14px", color: "var(--body)" }}>{label}</span>
                </Card>
              </div>
            ))}
          </div>
          <p className="founder-security" style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "var(--muted)" }}>
            <span>In addition, local security personnel are arranged according to Iraqi regulations.</span>
          </p>
        </div>
      </section>

      {/* ═══════════ POPULAR FAVORITES ═══════════ */}
      <section className="section" ref={favoritesRef}>
        <div className="container" style={{ textAlign: "center" }}>
          <SectionHeader
            title="Customer Favorites"
            text="Authentic flavors and quality preparation have made these dishes the most loved choices among our guests."
          />
          <div className="founder-favorites">
            {FAVORITES.map((dish) => (
              <span key={dish} className="founder-favorite" style={{ opacity: 0 }}>
                {dish}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ RESTAURANT EXPERIENCE ═══════════ */}
      <section className="section muted-band" ref={hoursRef}>
        <div className="container" style={{ textAlign: "center" }}>
          <SectionHeader
            title="Restaurant Experience &amp; Services"
            text="During the daytime, the restaurant focuses on serving delicious meals, while in the evening it transforms into a vibrant bar and entertainment destination."
          />
          <div className="founder-hours" style={{ opacity: 0 }}>
            <div className="founder-hours-item">
              <span className="founder-hours-label">Opening Hours</span>
              <span className="founder-hours-value">9:00 AM – 1:00 AM Daily</span>
            </div>
            <div className="founder-hours-extended">
              Extended hours during busy days — sometimes operating until 3:00–4:00 AM.
              Additional security arrangements are made on Fridays and busy occasions to ensure a safe
              and comfortable environment for all guests.
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CLOSING ═══════════ */}
      <section className="section founder-closing motif" ref={closingRef}>
        <div className="container" style={{ maxWidth: 860, textAlign: "center" }}>
          <h2 className="founder-final-heading" style={{ fontSize: "clamp(34px, 4vw, 52px)", margin: "0 0 24px" }}>
            A Taste of Nepal Beyond Borders
          </h2>
          <p className="founder-final-body" style={{ lineHeight: 1.8, fontSize: "18px", color: "var(--body)", marginBottom: "12px" }}>
            Arjun Tamang&apos;s journey is more than just a business story. It represents
            the passion of a Nepali entrepreneur who brought the flavors, culture, and
            hospitality of Nepal to Iraq.
          </p>

          <div ref={barRef} style={GOLD_BAR} />

          <blockquote className="founder-final-quote" style={QUOTE_STYLE}>
            Food connects cultures, and hospitality creates lasting memories.
            <footer style={{ marginTop: "16px", fontSize: "15px", fontStyle: "normal", color: "var(--primary)" }}>
              — Arjun Tamang
            </footer>
          </blockquote>

          <div className="founder-final-cta">
            <Button href="/reservation">Visit Nepali Restaurant &amp; Bar</Button>
          </div>
        </div>
      </section>
    </>
  );
}
