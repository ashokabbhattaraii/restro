export type DayHours = {
  open: string;
  close: string;
  closed: boolean;
};

export type GlimpseImage = {
  src: string;
  label: string;
};

export type GlimpseInside = {
  title: string;
  subtitle: string;
  images: GlimpseImage[];
};

export type RestaurantConfig = {
  acceptingReservations: boolean;
  maxGuests: number;
  maxDaysAhead: number;
  slotIntervalMinutes: number;
  hours: Record<string, DayHours>;
  closedDates: string[];
  phoneOne: string;
  phoneTwo: string;
  location: string;
  message: string;
  socialInstagram: string;
  socialFacebook: string;
  showOffers: boolean;
  eventTypes: string[];
  menuCategories: string[];
  galleryCategories: string[];
  glimpseInside: GlimpseInside;
};

const DEFAULT_GLIMPSE_IMAGES = [
  { src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=90", label: "Dining Area" },
  { src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1400&q=90", label: "Food" },
  { src: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&w=1400&q=90", label: "Bar" },
  { src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=90", label: "Interior" },
  { src: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=85", label: "Events" },
];

export const DEFAULT_CONFIG: RestaurantConfig = {
  acceptingReservations: true,
  maxGuests: 20,
  maxDaysAhead: 30,
  slotIntervalMinutes: 30,
  hours: {
    Monday: { open: "09:00", close: "01:00", closed: false },
    Tuesday: { open: "09:00", close: "01:00", closed: false },
    Wednesday: { open: "09:00", close: "01:00", closed: false },
    Thursday: { open: "09:00", close: "01:00", closed: false },
    Friday: { open: "09:00", close: "01:00", closed: false },
    Saturday: { open: "09:00", close: "01:00", closed: false },
    Sunday: { open: "09:00", close: "01:00", closed: false },
  },
  closedDates: [],
  phoneOne: "07701477472",
  phoneTwo: "07507752476",
  location: "46001 As Sulaymaniyah, Iraq",
  message: "",
  socialInstagram: "@nepali.restaurant.bar",
  socialFacebook: "Nepali Restaurant & Bar",
  showOffers: true,
  eventTypes: ["Live Music", "Happy Hour", "Festival", "Special", "Cultural", "Dinner"],
  menuCategories: ["All", "Nepali", "Indian", "Chinese", "Japanese", "BBQ & Grill", "Drinks & Bar", "Desserts"],
  galleryCategories: ["All", "Food", "Dining Area", "Bar", "Events", "Exterior"],
  glimpseInside: {
    title: "A Glimpse Inside",
    subtitle: "From mountain-inspired interiors to gold-lit plates — a visual taste of the experience.",
    images: DEFAULT_GLIMPSE_IMAGES,
  },
};
