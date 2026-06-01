export type MenuItem = {
  id: string;
  name: string;
  category: "Nepali" | "Indian" | "Chinese" | "BBQ & Grill" | "Drinks & Bar" | "Desserts";
  description: string;
  price: string;
  dietary: string[];
  image: string;
  featured?: boolean;
  visible?: boolean;
};

export type GalleryImage = {
  id: string;
  category: "Food" | "Dining Area" | "Bar" | "Events" | "Exterior";
  title: string;
  image: string;
  shape?: "tall" | "wide" | "";
};

export type EventItem = {
  id: string;
  date: string;
  time?: string;
  title: string;
  description: string;
  image: string;
  type?: string;
  active?: boolean;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  image: string;
  visible: boolean;
};

export type Reservation = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  occasion?: string;
  status: "Confirmed" | "Pending" | "Cancelled";
};

export type Message = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  subject: string;
  message: string;
  read: boolean;
  replied?: boolean;
  createdAt: string;
};
