import { z } from "zod";

// An image reference accepted from admin forms. Cloudinary/remote uploads return
// an absolute https URL, while the local-storage fallback returns a site-relative
// path like "/uploads/abc.jpg". Data URIs are also allowed. Using z.string().url()
// alone rejected the "/uploads/..." fallback and produced "Invalid input".
export const imageRef = z
  .string()
  .trim()
  .min(1, "Image is required")
  .refine(
    (v) =>
      /^https?:\/\//i.test(v) || // absolute URL (Cloudinary, Unsplash, etc.)
      v.startsWith("/") ||        // site-relative path (/uploads/…, /images/…)
      v.startsWith("data:image/"),// inline data URI
    { message: "Must be an image URL or an uploaded image path" }
  );

export const reservationSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(120, "Name is too long"),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(32, "Phone number is too long"),
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  date: z.string().trim().min(4, "Please select a date").max(40),
  time: z.string().trim().min(3, "Please select a time").max(20),
  guests: z.coerce.number().int("Enter a valid number").min(1, "At least 1 guest").max(30, "Maximum 30 guests"),
  occasion: z.string().trim().max(80).optional(),
  requests: z.string().trim().max(1000, "Message is too long").optional(),
  recaptchaToken: z.string().trim().min(1, "reCAPTCHA verification is required"),
});

export const messageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(32).optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(5).max(2000),
  contactType: z.enum(["feedback", "enquiry", "other"]),
  rating: z.number().int().min(1).max(5).optional(),
}).refine(
  (data) => data.contactType !== "feedback" || data.rating !== undefined,
  { message: "Rating is required for feedback", path: ["rating"] }
);

export const menuItemSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120, "Name is too long"),
  category: z.string().trim().min(2, "Select a category").max(80, "Category is too long"),
  description: z.string().trim().min(5, "Description must be at least 5 characters").max(500, "Description is too long"),
  price: z.string().trim().min(2, "Enter a price").max(40, "Price is too long"),
  dietary: z.array(z.string().trim().max(30)).default([]),
  image: imageRef,
  featured: z.boolean().optional(),
  visible: z.boolean().optional(),
});

export const gallerySchema = z.object({
  category: z.string().trim().min(2).max(80),
  title: z.string().trim().min(2).max(120),
  image: imageRef,
  shape: z.enum(["", "tall", "wide"]).optional(),
});

export const eventSchema = z.object({
  title: z.string().trim().min(2).max(140),
  description: z.string().trim().min(5).max(800),
  date: z.string().trim().min(2).max(40),
  time: z.string().trim().max(30).optional(),
  image: imageRef,
  type: z.string().trim().max(80).optional(),
  active: z.boolean().optional(),
});

export const staffSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(120),
  // Department/bio are optional in the admin form — accept empty values.
  department: z.string().trim().max(80).optional().default(""),
  bio: z.string().trim().max(500).optional().default(""),
  image: imageRef,
  visible: z.boolean().optional(),
});
