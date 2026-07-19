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
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(32),
  email: z.string().trim().email().optional().or(z.literal("")),
  date: z.string().trim().min(4).max(40),
  time: z.string().trim().min(3).max(20),
  guests: z.coerce.number().int().min(1).max(30),
  occasion: z.string().trim().max(80).optional(),
  requests: z.string().trim().max(1000).optional(),
});

export const messageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(32).optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(5).max(2000),
  contactType: z.enum(["feedback", "enquiry", "other"]),
  rating: z.number().int().min(1).max(5).optional(),
});

export const menuItemSchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(80),
  description: z.string().trim().min(5).max(500),
  price: z.string().trim().min(2).max(40),
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
