import { z } from "zod";

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
  message: z.string().trim().min(5).max(1500),
});

export const menuItemSchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(80),
  description: z.string().trim().min(5).max(500),
  price: z.string().trim().min(2).max(40),
  dietary: z.array(z.string().trim().max(30)).default([]),
  image: z.string().trim().url(),
  featured: z.boolean().optional(),
  visible: z.boolean().optional(),
});

export const gallerySchema = z.object({
  category: z.string().trim().min(2).max(80),
  title: z.string().trim().min(2).max(120),
  image: z.string().trim().url(),
  shape: z.enum(["", "tall", "wide"]).optional(),
});

export const eventSchema = z.object({
  title: z.string().trim().min(2).max(140),
  description: z.string().trim().min(5).max(800),
  date: z.string().trim().min(2).max(40),
  time: z.string().trim().max(30).optional(),
  image: z.string().trim().url(),
  type: z.string().trim().max(80).optional(),
  active: z.boolean().optional(),
});

export const staffSchema = z.object({
  name: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(120),
  department: z.string().trim().min(2).max(80),
  bio: z.string().trim().max(500),
  image: z.string().trim().url(),
  visible: z.boolean().optional(),
});
