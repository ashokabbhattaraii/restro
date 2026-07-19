"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { gsap, ScrollTrigger, initGSAP } from "@/lib/gsap";
import PageHero from "@/components/shared/PageHero";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { restaurant } from "@/lib/constants";
import { reservationSchema } from "@/lib/validations";
import { useCreateReservation } from "@/hooks/useApi";
import { useFormDraft } from "@/hooks/useFormDraft";
import type { RestaurantConfig } from "@/lib/config";
import { DEFAULT_CONFIG } from "@/lib/config";
import { Loader2, Clock } from "lucide-react";


const occasions = ["Birthday", "Anniversary", "Business", "Date Night", "Other"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function generateTimeSlots(config: RestaurantConfig, dateStr?: string): string[] {
  if (!dateStr) return [];
  const date = new Date(dateStr + "T12:00:00");
  const dayName = DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
  const dayHours = config.hours[dayName];
  if (!dayHours || dayHours.closed) return [];

  const [openH, openM] = dayHours.open.split(":").map(Number);
  const [closeH, closeM] = dayHours.close.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  const interval = config.slotIntervalMinutes || 30;

  const slots: string[] = [];
  for (let m = openMinutes; m < closeMinutes; m += interval) {
    const h24 = Math.floor(m / 60);
    const min = m % 60;
    const suffix = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 > 12 ? h24 - 12 : h24;
    slots.push(`${h12}:${min.toString().padStart(2, "0")} ${suffix}`);
  }
  return slots;
}

function getDayStatus(dateStr: string, config: RestaurantConfig): "open" | "closed" | "past" {
  const date = new Date(dateStr + "T12:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return "past";

  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() + config.maxDaysAhead);
  if (date > cutoff) return "past";

  const dayName = DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
  const dayHours = config.hours[dayName];
  if (!dayHours || dayHours.closed) return "closed";

  const dateStrOnly = dateStr.slice(0, 10);
  if (config.closedDates?.includes(dateStrOnly)) return "closed";

  return "open";
}

type ReservationFormInput = z.input<typeof reservationSchema>;
type ReservationFormOutput = z.output<typeof reservationSchema>;

export default function ReservationForm() {
  initGSAP();
  const [occasion, setOccasion] = useState("Birthday");
  const [config, setConfig] = useState<RestaurantConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const formCardRef = useRef<HTMLDivElement>(null);
  const hoursCardRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const createReservation = useCreateReservation();

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => setConfig(data))
      .catch(() => setConfig(DEFAULT_CONFIG))
      .finally(() => setConfigLoading(false));
  }, []);

  const form = useForm<ReservationFormInput, unknown, ReservationFormOutput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { guests: 2, occasion },
  });

  const { clearDraft } = useFormDraft(form, "reservation");

  useEffect(() => {
    const sub = form.watch((values) => {
      localStorage.setItem("form-draft:reservation", JSON.stringify(values));
    });
    return () => sub.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (configLoading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        formCardRef.current,
        { opacity: 0, x: -60, scale: 0.96 },
        {
          opacity: 1, x: 0, scale: 1, duration: 0.62, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );

      gsap.fromTo(
        hoursCardRef.current,
        { opacity: 0, x: 60, scale: 0.96 },
        {
          opacity: 1, x: 0, scale: 1, duration: 0.62, ease: "power3.out", delay: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );

      const labels = formCardRef.current?.querySelectorAll("label, .occasion-field, .info-strip") ?? [];
      gsap.fromTo(
        labels,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.33, stagger: 0.05,
          scrollTrigger: { trigger: formCardRef.current, start: "top 75%", once: true },
          delay: 0.3,
        }
      );

      const rows = hoursCardRef.current?.querySelectorAll("li") ?? [];
      gsap.fromTo(
        rows,
        { opacity: 0, x: 20 },
        {
          opacity: 1, x: 0, duration: 0.29, stagger: 0.05,
          scrollTrigger: { trigger: hoursCardRef.current, start: "top 80%", once: true },
          delay: 0.4,
        }
      );
    });

    return () => ctx.revert();
  }, [configLoading]);

  const watchDate = form.watch("date");
  useEffect(() => {
    setSelectedDate(watchDate || "");
  }, [watchDate]);

  const times = config ? generateTimeSlots(config, selectedDate) : [];
  const dayStatus = config && selectedDate ? getDayStatus(selectedDate, config) : "open";
  const maxGuests = config?.maxGuests || 20;
  const todayStr = new Date().toISOString().slice(0, 10);
  const maxDate = config ? (() => {
    const d = new Date();
    d.setDate(d.getDate() + config.maxDaysAhead);
    return d.toISOString().slice(0, 10);
  })() : "";

  const submit = form.handleSubmit(async (values) => {
    if (config && !config.acceptingReservations) {
      toast.error("We are currently not accepting reservations.");
      return;
    }
    try {
      await createReservation.mutateAsync({ ...values, occasion });
      toast.success("Reservation request received! We'll confirm shortly.");
      form.reset();
      clearDraft();
    } catch {
      toast.error("Reservation could not be sent.");
    }
  });

  if (configLoading) {
    return (
      <main>
        <PageHero eyebrow="Reservation" title="Reserve a Table" text="We look forward to welcoming you" />
        <section className="section" style={{ display: "grid", placeItems: "center", minHeight: 300 }}>
          <Loader2 size={28} className="animate-spin" style={{ color: "var(--primary)" }} />
        </section>
      </main>
    );
  }

  if (config && !config.acceptingReservations) {
    return (
      <main>
        <PageHero eyebrow="Reservation" title="Reservations Closed" text="We look forward to welcoming you" />
        <section className="section" style={{ textAlign: "center", padding: "60px 24px" }}>
          <Card className="reservation-form" style={{ maxWidth: 500, margin: "0 auto" }}>
            <Clock size={32} style={{ color: "var(--primary)", marginBottom: 12 }} />
            <h2 style={{ margin: "0 0 8px" }}>Not Accepting Bookings</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
              {config.message || "We are currently not accepting online reservations. Please call us to book a table."}
            </p>
            <div style={{ marginTop: 16 }}>
              <Button href={`tel:${config.phoneOne}`}>Call {config.phoneOne}</Button>
            </div>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <>
      <PageHero eyebrow="Reservation" title="Reserve a Table" text="We look forward to welcoming you" />
      <section className="section" ref={sectionRef}>
        <div className="container reservation-layout">
          <div ref={formCardRef} style={{ opacity: 0 }}>
            <Card className="reservation-form">
              <form onSubmit={submit}>
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
                    <Input {...form.register("date")} type="date" min={todayStr} max={maxDate} />
                  </label>
                  <label>
                    <span>Time</span>
                    <Select {...form.register("time")}>
                      {!selectedDate ? (
                        <option value="">Select a date first</option>
                      ) : dayStatus === "closed" ? (
                        <option value="">Closed on this day</option>
                      ) : times.length === 0 ? (
                        <option value="">No available slots</option>
                      ) : (
                        times.map((time) => <option key={time}>{time}</option>)
                      )}
                    </Select>
                  </label>
                  <label>
                    <span>Number of Guests</span>
                    <Select {...form.register("guests")}>
                      {Array.from({ length: maxGuests }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}{i === maxGuests - 1 ? "+" : ""} Guest{i > 0 ? "s" : ""}</option>
                      ))}
                    </Select>
                  </label>
                </div>

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

                <Button className="submit-btn" type="submit" disabled={createReservation.isPending || (!!selectedDate && dayStatus === "closed")}>
                  {createReservation.isPending ? "Submitting..." : "Confirm Reservation"}
                </Button>

                <p className="info-strip" style={{ marginTop: "16px" }}>
                  📞 Or call us: <strong>{config?.phoneOne || restaurant.phoneOne}</strong> · <strong>{config?.phoneTwo || restaurant.phoneTwo}</strong>
                </p>
              </form>
            </Card>
          </div>

          <div ref={hoursCardRef} style={{ opacity: 0 }}>
            <Card className="hours-card" style={{ position: "sticky", top: "calc(var(--nav-height) + 24px)" }}>
              <div style={{ marginBottom: "24px" }}>
                <div style={{
                  width: "40px", height: "3px",
                  background: "linear-gradient(90deg, var(--primary), transparent)",
                  marginBottom: "12px", borderRadius: "2px",
                }} />
                <h2 style={{ margin: 0, fontSize: "22px" }}>Opening Hours</h2>
              </div>

              <ul>
                {DAYS.map((day) => {
                  const dayHours = config?.hours[day];
                  const closed = dayHours?.closed;
                  return (
                    <li key={day} style={closed ? { opacity: 0.4 } : {}}>
                      <span>{day}</span>
                      <strong>{closed ? "Closed" : `${dayHours?.open?.slice(0, 5) || "11:00"} – ${dayHours?.close?.slice(0, 5) || "23:00"}`}</strong>
                    </li>
                  );
                })}
              </ul>

              <div style={{
                height: "1px",
                background: "rgba(242,202,80,0.15)",
                margin: "20px 0",
              }} />

              <p style={{ fontSize: "13px", lineHeight: 1.65, marginBottom: "20px" }}>
                We recommend reservations for weekends and cultural event nights to guarantee your preferred table.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "📞 Call", value: config?.phoneOne || restaurant.phoneOne, href: `tel:${config?.phoneOne || restaurant.phoneOne}` },
                  { label: "📞 Call", value: config?.phoneTwo || restaurant.phoneTwo, href: `tel:${config?.phoneTwo || restaurant.phoneTwo}` },
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
