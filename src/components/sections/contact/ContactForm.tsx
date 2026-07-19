"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { messageSchema } from "@/lib/validations";
import { useCreateMessage } from "@/hooks/useApi";
import { useFormDraft } from "@/hooks/useFormDraft";

type ContactData = z.infer<typeof messageSchema>;

export default function ContactForm() {
  const form = useForm<ContactData>({
    resolver: zodResolver(messageSchema),
  });
  const createMessage = useCreateMessage();
  const { clearDraft } = useFormDraft(form, "contact");

  const submit = form.handleSubmit(async (values) => {
    try {
      await createMessage.mutateAsync(values);
      toast.success("Message sent.");
      form.reset();
      clearDraft();
    } catch {
      toast.error("Message could not be sent.");
    }
  });

  return (
    <Card className="contact-form">
      <form onSubmit={submit}>
        <h2>Send Message</h2>
        <label><span>Name</span><Input {...form.register("name")} /></label>
        <label><span>Phone</span><Input {...form.register("phone")} type="tel" /></label>
        <label><span>Email</span><Input {...form.register("email")} type="email" /></label>
        <label>
          <span>Subject</span>
          <Select {...form.register("subject")}>
            <option>Reservation</option>
            <option>Private Event</option>
            <option>Feedback</option>
            <option>Other</option>
          </Select>
        </label>
        <label><span>Message</span><Textarea {...form.register("message")} rows={4} /></label>
        <Button className="submit-btn" type="submit" disabled={createMessage.isPending}>
          {createMessage.isPending ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Card>
  );
}
