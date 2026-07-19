export type MenuItem = {
  _id?: string;
  id?: string;
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
  _id?: string;
  id?: string;
  category: "Food" | "Dining Area" | "Bar" | "Events" | "Exterior";
  title: string;
  image: string;
  shape?: "tall" | "wide" | "";
  order?: number;
};

export type EventItem = {
  _id?: string;
  id?: string;
  date: string;
  time?: string;
  title: string;
  description: string;
  image: string;
  type?: string;
  active?: boolean;
};

export type StaffMember = {
  _id?: string;
  id?: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  image: string;
  visible: boolean;
};

export type Reservation = {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  occasion?: string;
  requests?: string;
  remarks?: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Contacted";
};

export type Message = {
  _id?: string;
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  subject: string;
  message: string;
  read: boolean;
  replied?: boolean;
  createdAt: string;
};

export type AuditAction =
  | "create" | "update" | "delete"
  | "import" | "bulk-update"
  | "login" | "view";

export type AuditResource =
  | "menu" | "reservation" | "event" | "staff" | "gallery" | "message";

export type AuditLogEntry = {
  id: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  summary: string;
  details?: Record<string, unknown>;
  timestamp: string;
  admin: string;
};
