"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initGSAP } from "@/lib/gsap";
import Image from "next/image";
import PageHero from "@/components/shared/PageHero";
import SectionHeader from "@/components/shared/SectionHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { images } from "@/lib/constants";

const MILESTONES = [
  { year: "2013", title: "Moved to Iraq", text: "Arrived with a dream and a vision to share Nepali cuisine." },
  { year: "2013–2014", title: "Learning & Adapting", text: "Learned the language, culture, and local market." },
  { year: "2014–2015", title: "Legal & Licensed", text: "Got legal license and started the restaurant." },
  { year: "2016–2018", title: "Growing the Team", text: "Built a strong team and served our first loyal customers." },
  { year: "2019–Now", title: "Expanding & Thriving", text: "Continuing to grow and serve with passion and pride." },
];

const STATS = [
  { value: "2013", label: "Started in Iraq" },
  { value: "Legal", label: "Licensed by Iraqi Government" },
  { value: "13+", label: "Team Members" },
  { value: "24h", label: "Hospitality & Service" },
  { value: "1000+", label: "Happy Customers" },
];

const CUISINES = [
  { name: "Nepali", icon: "🍛" },
  { name: "Indian", icon: "🍲" },
  { name: "Chinese", icon: "🥡" },
  { name: "Japanese", icon: "🍜" },
];

const LANGUAGES = [
  { name: "Arabic", note: "Local communication" },
  { name: "Kurdish", note: "Community & suppliers" },
  { name: "English", note: "Guests & partners" },
  { name: "Basic Chinese", note: "Kitchen coordination" },
];

export default function StorySection() {
  initGSAP();
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const cuisineRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Stats bar */
      const statItems = heroStatsRef.current?.querySelectorAll(".about-stat") ?? [];
      gsap.set(statItems, { opacity: 0, y: 30 });
      ScrollTrigger.create({
        trigger: heroStatsRef.current,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(statItems, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power3.out" });
        },
      });

      /* Story section */
      const storyImg = storyRef.current?.querySelector(".story-img") ?? null;
      const storyCopy = storyRef.current?.querySelector(".story-text") ?? null;
      const storyTl = gsap.timeline({
        scrollTrigger: { trigger: storyRef.current, start: "top 75%", once: true },
        defaults: { ease: "power3.out" },
      });
      storyTl
        .fromTo(storyCopy, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.55 })
        .fromTo(storyImg, { opacity: 0, x: 50, scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 0.6 }, "-=0.5");

      /* Cuisine cards */
      const cuisineCards = cuisineRef.current?.querySelectorAll(".cuisine-card") ?? [];
      gsap.set(cuisineCards, { opacity: 0, y: 30, scale: 0.92 });
      ScrollTrigger.create({
        trigger: cuisineRef.current,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(cuisineCards, { opacity: 1, y: 0, scale: 1, duration: 0.38, stagger: 0.07, ease: "power3.out" });
        },
      });

      /* Journey milestones */
      const milestones = journeyRef.current?.querySelectorAll(".journey-step") ?? [];
      gsap.set(milestones, { opacity: 0, y: 40 });
      ScrollTrigger.create({
        trigger: journeyRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(milestones, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power3.out" });
        },
      });

      /* Languages */
      const langs = langRef.current?.querySelectorAll(".lang-card") ?? [];
      gsap.set(langs, { opacity: 0, y: 24 });
      ScrollTrigger.create({
        trigger: langRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(langs, { opacity: 1, y: 0, duration: 0.36, stagger: 0.07, ease: "power3.out" });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Our Story"
        text="From Nepal to Iraq — a journey of passion, courage, and dedication to serve authentic flavors."
      />

      {/* Stats bar */}
      <div className="about-stats-bar" ref={heroStatsRef}>
        <div className="container">
          <div className="about-stats-row">
            {STATS.map(({ value, label }) => (
              <div key={label} className="about-stat" style={{ opacity: 0 }}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story + Cuisine */}
      <section className="section" id="story" ref={storyRef}>
        <div className="container about-story-grid">
          <div className="story-text" style={{ opacity: 0 }}>
            <p className="eyebrow-label">Our Story</p>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 44px)", margin: "0 0 18px", lineHeight: 1.1 }}>
              A Dream That Became Reality
            </h2>
            <p style={{ marginBottom: "16px", lineHeight: 1.75 }}>
              Born in Belkotgadhi Municipality, Nuwakot, Nepal, Arjun Tamang
              moved to Iraq in 2013 with a dream to introduce authentic Asian
              cuisine to the people of Sulaymaniyah.
            </p>
            <p style={{ marginBottom: "24px", lineHeight: 1.75 }}>
              With hard work and determination, he established Nepali Restaurant
              &amp; Bar — a place where food, hospitality, and culture come
              together. Today the restaurant serves a wide variety of dishes
              including Nepali, Indian, Chinese, and Japanese cuisines along with
              a full bar and entertainment.
            </p>
            <Button href="/menu" variant="ghost">Explore Our Menu</Button>
          </div>

          <div className="story-img" style={{ opacity: 0, position: "relative" }}>
            <div className="story-img-frame">
              <Image
                src={images.owner}
                alt="Arjun Tamang — Founder"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
          </div>

          {/* Cuisine block */}
          <div className="cuisine-block">
            <p className="eyebrow-label">Our Cuisine</p>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", margin: "0 0 14px", lineHeight: 1.1 }}>
              A Taste of Asia
            </h2>
            <p style={{ marginBottom: "20px", lineHeight: 1.7, fontSize: "15px" }}>
              We serve a wide variety of dishes including Nepali, Indian, Chinese and
              Japanese cuisine along with a range of beverages.
            </p>
            <div ref={cuisineRef} className="cuisine-grid">
              {CUISINES.map(({ name, icon }) => (
                <div key={name} className="cuisine-card" style={{ opacity: 0 }}>
                  <span className="cuisine-icon">{icon}</span>
                  <span className="cuisine-name">{name}</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: "16px", fontSize: "14px", color: "var(--primary)", fontWeight: 600 }}>
              Popular Items:
            </p>
            <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>
              Veg &amp; Non-Veg Set, Momo, Chowmein, Noodles, Samosa, Roti, Curry, Ramen and more.
            </p>
          </div>
        </div>
      </section>

      {/* Journey timeline */}
      <section className="section muted-band" id="journey">
        <div className="container">
          <SectionHeader
            title="A Journey of Passion"
            text="From a dream in Nepal to a thriving restaurant in Iraq — every step built with determination."
          />
          <div ref={journeyRef} className="journey-timeline">
            {MILESTONES.map(({ year, title, text }) => (
              <div key={year} className="journey-step" style={{ opacity: 0 }}>
                <div className="journey-dot" />
                <strong className="journey-year">{year}</strong>
                <p className="journey-title">{title}</p>
                <p className="journey-text">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="section">
        <div className="container">
          <SectionHeader
            title="Multilingual Communication"
            text="Arjun's ability to speak multiple languages has helped build strong relationships with customers, employees, and the local community."
          />
          <div ref={langRef} className="lang-grid">
            {LANGUAGES.map(({ name, note }) => (
              <Card key={name} className="lang-card" style={{ opacity: 0, padding: "24px", textAlign: "center" }}>
                <h3 style={{ fontSize: "20px", margin: "0 0 4px", color: "var(--primary)" }}>{name}</h3>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>{note}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
