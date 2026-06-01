"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import PageHero from "@/components/shared/PageHero";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { restaurant } from "@/lib/constants";
import { reservationSchema } from "@/lib/validations";

const occasions = ["Birthday", "Anniversary", "Business", "Date Night", "Other"];
const times = Array.from({ length: 25 }, (_, index) => {
  const totalMinutes = 11 * 60 + index * 30;
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 > 12 ? hour24 - 12 : hour24;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${suffix}`;
});

type ReservationFormInput = z.input<typeof reservationSchema>;
type ReservationFormOutput = z.output<typeof reservationSchema>;

export default function ReservationForm() {
  const [occasion, setOccasion] = useState("Birthday");
  const form = useForm<ReservationFormInput, unknown, ReservationFormOutput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { guests: 2, occasion },
  });

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

    toast.success("Reservation request received.");
    form.reset();
  });

  return (
    <>
      <PageHero eyebrow="Reservation" title="Reserve a Table" text="We look forward to welcoming you" />
      <section className="section">
        <div className="container reservation-layout">
          <Card className="reservation-form">
            <form onSubmit={submit}>
              <h2>Reservation Details</h2>
              <div className="form-grid">
                <label><span>Full Name</span><Input {...form.register("name")} /></label>
                <label><span>Phone Number</span><Input {...form.register("phone")} type="tel" /></label>
                <label><span>Email Address</span><Input {...form.register("email")} type="email" /></label>
                <label><span>Date</span><Input {...form.register("date")} type="date" /></label>
                <label><span>Time</span><Select {...form.register("time")}>{times.map((time) => <option key={time}>{time}</option>)}</Select></label>
                <label><span>Number of Guests</span><Select {...form.register("guests")}>{Array.from({ length: 20 }, (_, index) => <option key={index + 1}>{index === 19 ? "20" : index + 1}</option>)}</Select></label>
              </div>
              <div className="occasion-field">
                <span>Occasion</span>
                <div className="occasion-row">
                  {occasions.map((item) => (
                    <button className={occasion === item ? "active" : ""} key={item} onClick={() => setOccasion(item)} type="button">
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <label><span>Special Requests</span><Textarea {...form.register("requests")} rows={3} /></label>
              <Button className="submit-btn" type="submit">Confirm Reservation</Button>
              <p className="info-strip">Or call us directly: {restaurant.phoneOne} · {restaurant.phoneTwo}</p>
            </form>
          </Card>
          <Card className="hours-card">
            <h2>Opening Hours</h2>
            <ul>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <li key={day}><span>{day}</span><strong>11:00 AM - 11:00 PM</strong></li>
              ))}
            </ul>
            <p>We recommend reservations for weekends and cultural event nights.</p>
          </Card>
        </div>
      </section>
    </>
  );
}
