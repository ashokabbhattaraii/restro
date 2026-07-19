"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Star, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { messageSchema } from "@/lib/validations";
import { useCreateMessage } from "@/hooks/useApi";
import { useFormDraft } from "@/hooks/useFormDraft";

type ContactData = z.infer<typeof messageSchema>;

const SUBJECT_OPTIONS: Record<string, string[]> = {
  feedback: ["Food Quality", "Service Experience", "Atmosphere", "Value for Money", "Overall Experience", "Other"],
  enquiry: ["Reservation Question", "Menu Inquiry", "Dietary Requirements", "Location & Hours", "Private Dining", "Other"],
  other: ["Other"],
};

export default function ContactForm() {
  const form = useForm<ContactData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      contactType: "enquiry",
      subject: "",
      rating: undefined,
    },
  });
  const createMessage = useCreateMessage();
  const { clearDraft } = useFormDraft(form, "contact");
  const contactType = useWatch({ control: form.control, name: "contactType" }) || "enquiry";
  const rating = useWatch({ control: form.control, name: "rating" });
  const subjectOptions = SUBJECT_OPTIONS[contactType] || SUBJECT_OPTIONS.enquiry;

  const isFeedback = contactType === "feedback";

  const submit = form.handleSubmit(async (values) => {
    try {
      await createMessage.mutateAsync(values);
      const message = contactType === "feedback" 
        ? "Thank you for your review! Your feedback has been recorded."
        : "Message sent successfully! Our team will reach out through your email as soon as possible.";
      toast.success(message);
      form.reset({ contactType: "enquiry", subject: "", rating: undefined });
      clearDraft();
    } catch {
      toast.error("Message could not be sent. Please try again.");
    }
  });

  return (
    <Card className="contact-form">
      <form onSubmit={submit}>
        <div className="form-header">
          <h2>Send Us a Message</h2>
          <p>Choose a topic so we can route your message to the right team.</p>
        </div>

        <div className="form-grid">
          <label className="form-field">
            <span>Contact Type</span>
            <Select {...form.register("contactType")}>
              <option value="">Select type</option>
              <option value="feedback">Feedback / Review</option>
              <option value="enquiry">Enquiry</option>
              <option value="other">Other</option>
            </Select>
            {form.formState.errors.contactType && (
              <span className="form-error">{form.formState.errors.contactType.message}</span>
            )}
          </label>

          <label className="form-field full-width">
            <span>Your Name</span>
            <Input {...form.register("name")} placeholder="Full name" autoComplete="name" />
            {form.formState.errors.name && (
              <span className="form-error">{form.formState.errors.name.message}</span>
            )}
          </label>

          <label className="form-field">
            <span>Email</span>
            <Input {...form.register("email")} type="email" placeholder="you@example.com" autoComplete="email" />
            {form.formState.errors.email && (
              <span className="form-error">{form.formState.errors.email.message}</span>
            )}
          </label>

          <label className="form-field">
            <span>Phone (optional)</span>
            <Input {...form.register("phone")} type="tel" placeholder="+964 7xx xxx xxx" autoComplete="tel" />
            {form.formState.errors.phone && (
              <span className="form-error">{form.formState.errors.phone.message}</span>
            )}
          </label>

          <label className="form-field full-width">
            <span>Subject</span>
            <Select {...form.register("subject")}>
              <option value="">Select a subject</option>
              {subjectOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </Select>
            {form.formState.errors.subject && (
              <span className="form-error">{form.formState.errors.subject.message}</span>
            )}
          </label>

          {isFeedback && (
            <label className="form-field full-width rating-field">
              <span>Your Rating</span>
              <div className="star-rating" role="radiogroup" aria-label="Rate your experience">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${(rating ?? 0) >= star ? "filled" : ""}`}
                    onClick={() => form.setValue("rating", star, { shouldValidate: true })}
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                    aria-pressed={rating === star}
                  >
                    <Star size={28} fill={(rating ?? 0) >= star ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              {form.formState.errors.rating && (
                <span className="form-error">{form.formState.errors.rating.message}</span>
              )}
            </label>
          )}

          <label className="form-field full-width">
            <span>Message</span>
            <Textarea
              {...form.register("message")}
              rows={isFeedback ? 5 : 4}
              placeholder={isFeedback
                ? "Tell us about your experience — what did you love? What could we improve?"
                : "How can we help you?"}
            />
            {form.formState.errors.message && (
              <span className="form-error">{form.formState.errors.message.message}</span>
            )}
          </label>
        </div>

        <Button className="submit-btn" type="submit" disabled={createMessage.isPending}>
          {createMessage.isPending ? <><Loader2 size={18} className="animate-spin" /> Sending…</> : "Send Message"}
        </Button>
      </form>
    </Card>
  );
}