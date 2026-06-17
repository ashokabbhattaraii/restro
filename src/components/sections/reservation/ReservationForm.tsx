"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageHero from "@/components/shared/PageHero";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { restaurant } from "@/lib/constants";
import { reservationSchema } from "@/lib/validations";

gsap.registerPlugin(ScrollTrigger);

const occasions = ["Birthday", "Anniversary", "Business", "Date Night", "Other"];
const times = Array.from({ length: 25 }, (_, index) => {
  const totalMinutes = 11 * 60 + index * 30;
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 > 12 ? hour24 - 12 : hour24;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${suffix}`;
});

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type ReservationFormInput = z.input<typeof reservationSchema>;
type ReservationFormOutput = z.output<typeof reservationSchema>;

export default function ReservationForm() {
  const [occasion, setOccasion] = useState("Birthday");
  const formCardRef = useRef<HTMLDivElement>(null);
  const hoursCardRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const form = useForm<ReservationFormInput, unknown, ReservationFormOutput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { guests: 2, occasion },
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Form card slide in from left */
      gsap.fromTo(
        formCardRef.current,
        { opacity: 0, x: -60, scale: 0.96 },
        {
          opacity: 1, x: 0, scale: 1, duration: 0.95, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );

      /* Hours card slide in from right */
      gsap.fromTo(
        hoursCardRef.current,
        { opacity: 0, x: 60, scale: 0.96 },
        {
          opacity: 1, x: 0, scale: 1, duration: 0.95, ease: "power3.out", delay: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );

      /* Form field labels stagger */
      const labels = formCardRef.current?.querySelectorAll("label, .occasion-field, .info-strip") ?? [];
      gsap.fromTo(
        labels,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.06,
          scrollTrigger: { trigger: formCardRef.current, start: "top 75%", once: true },
          delay: 0.3,
        }
      );

      /* Hours rows stagger */
      const rows = hoursCardRef.current?.querySelectorAll("li") ?? [];
      gsap.fromTo(
        rows,
        { opacity: 0, x: 20 },
        {
          opacity: 1, x: 0, duration: 0.45, stagger: 0.06,
          scrollTrigger: { trigger: hoursCardRef.current, start: "top 80%", once: true },
          delay: 0.4,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const submit = form.handleSubmit(async (values) => {
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, occasion }),
    });

    if (!response.ok) {
      toast.error("Reservation could not be sent.");
      return;
    }

    toast.success("Reservation request received! We'll confirm shortly.");
    form.reset();
  });

  return (
    <>
      <PageHero eyebrow="Reservation" title="Reserve a Table" text="We look forward to welcoming you" />
      <section className="section" ref={sectionRef}>
        <div className="container reservation-layout">
          {/* Form */}
          <div ref={formCardRef} style={{ opacity: 0 }}>
            <Card className="reservation-form">
              <form onSubmit={submit}>
                {/* Form header */}
                <div style={{ marginBottom: "28px" }}>
                  <div style={{
                    width: "40px", height: "3px",
                    background: "linear-gradient(90deg, var(--primary), transparent)",
                    marginBottom: "12px", borderRadius: "2px",
                  }} />
                  <h2 style={{ margin: 0 }}>Reservation Details</h2>
                  <p style={{ marginTop: "6px", fontSize: "14px" }}>
                    Fill in the details below and we&apos;ll confirm your table.
                  </p>
                </div>

                <div className="form-grid">
                  <label>
                    <span>Full Name</span>
                    <Input {...form.register("name")} placeholder="Your full name" />
                  </label>
                  <label>
                    <span>Phone Number</span>
                    <Input {...form.register("phone")} type="tel" placeholder="+964 xxx xxx xxxx" />
                  </label>
                  <label>
                    <span>Email Address</span>
                    <Input {...form.register("email")} type="email" placeholder="you@example.com" />
                  </label>
                  <label>
                    <span>Date</span>
                    <Input {...form.register("date")} type="date" />
                  </label>
                  <label>
                    <span>Time</span>
                    <Select {...form.register("time")}>
                      {times.map((time) => <option key={time}>{time}</option>)}
                    </Select>
                  </label>
                  <label>
                    <span>Number of Guests</span>
                    <Select {...form.register("guests")}>
                      {Array.from({ length: 20 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}{i === 19 ? "+" : ""} Guest{i > 0 ? "s" : ""}</option>
                      ))}
                    </Select>
                  </label>
                </div>

                {/* Occasion */}
                <div className="occasion-field">
                  <span>Occasion (Optional)</span>
                  <div className="occasion-row">
                    {occasions.map((item) => (
                      <button
                        className={occasion === item ? "active" : ""}
                        key={item}
                        onClick={() => setOccasion(item)}
                        type="button"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <label>
                  <span>Special Requests</span>
                  <Textarea
                    {...form.register("requests")}
                    rows={3}
                    placeholder="Dietary requirements, seating preferences, celebrations..."
                  />
                </label>

                <Button className="submit-btn" type="submit">
                  Confirm Reservation
                </Button>

                <p className="info-strip" style={{ marginTop: "16px" }}>
                  📞 Or call us: <strong>{restaurant.phoneOne}</strong> · <strong>{restaurant.phoneTwo}</strong>
                </p>
              </form>
            </Card>
          </div>

          {/* Hours sidebar */}
          <div ref={hoursCardRef} style={{ opacity: 0 }}>
            <Card className="hours-card" style={{ position: "sticky", top: "calc(var(--nav-height) + 24px)" }}>
              {/* Card header */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{
                  width: "40px", height: "3px",
                  background: "linear-gradient(90deg, var(--primary), transparent)",
                  marginBottom: "12px", borderRadius: "2px",
                }} />
                <h2 style={{ margin: 0, fontSize: "22px" }}>Opening Hours</h2>
              </div>

              <ul>
                {DAYS.map((day) => (
                  <li key={day}>
                    <span>{day}</span>
                    <strong>11:00 AM – 11:00 PM</strong>
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div style={{
                height: "1px",
                background: "rgba(242,202,80,0.15)",
                margin: "20px 0",
              }} />

              <p style={{ fontSize: "13px", lineHeight: 1.65, marginBottom: "20px" }}>
                We recommend reservations for weekends and cultural event nights to guarantee your preferred table.
              </p>

              {/* Contact quick links */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "📞 Call", value: restaurant.phoneOne, href: `tel:${restaurant.phoneOne}` },
                  { label: "📞 Call", value: restaurant.phoneTwo, href: `tel:${restaurant.phoneTwo}` },
                ].map(({ label, value, href }) => (
                  <a key={href} href={href} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    border: "1px solid rgba(242,202,80,0.20)",
                    borderRadius: "8px",
                    color: "var(--primary)",
                    fontWeight: 600,
                    fontSize: "14px",
                    transition: "background 200ms ease",
                  }}>
                    <span style={{ color: "var(--muted)", fontSize: "12px" }}>{label}</span>
                    {value}
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
