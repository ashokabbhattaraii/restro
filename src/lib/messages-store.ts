import type { Message } from "@/types";

type MessageInput = Omit<Message, "id" | "_id" | "createdAt" | "read" | "verified" | "replied">;

const CONTACT_TYPE_LABELS: Record<Message["contactType"], string> = {
  feedback: "Feedback",
  enquiry: "Enquiry",
  other: "Other",
};

const CONTACT_TYPE_COLORS: Record<Message["contactType"], string> = {
  feedback: "#27ae60",
  enquiry: "#3498db",
  other: "var(--muted)",
};

const messages: Message[] = [
  {
    id: "msg-1",
    name: "Sarah Johnson",
    phone: "07701234567",
    email: "sarah@example.com",
    subject: "Amazing dining experience!",
    message: "The dal bhat was absolutely incredible and the live music night was unforgettable. The staff treated us like family. Will definitely be back!",
    contactType: "feedback",
    rating: 5,
    verified: true,
    read: true,
    replied: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-2",
    name: "Ahmed Ali",
    phone: "07509876543",
    email: "ahmed@example.com",
    subject: "Birthday party inquiry",
    message: "Hi, I'd like to book a table for 12 people for a birthday celebration next Friday. Do you have a private area available?",
    contactType: "enquiry",
    verified: false,
    read: false,
    replied: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-3",
    name: "Priya Sharma",
    phone: "07701112233",
    email: "priya@example.com",
    subject: "Question about dietary options",
    message: "My husband has a nut allergy. Are your dishes clearly marked for allergens? We'd love to visit this weekend.",
    contactType: "enquiry",
    verified: false,
    read: false,
    replied: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-4",
    name: "James Wilson",
    phone: "07504445566",
    email: "james@example.com",
    subject: "Excellent service and food",
    message: "Had dinner last night and everything was perfect. The butter chicken was the best I've had in years. The cocktail menu is also creative and delicious. Highly recommend!",
    contactType: "feedback",
    rating: 5,
    verified: true,
    read: true,
    replied: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-5",
    name: "Maria Santos",
    phone: "07707778899",
    email: "maria@example.com",
    subject: "General question about opening hours",
    message: "Are you open on public holidays? Planning to visit next week.",
    contactType: "other",
    verified: false,
    read: false,
    replied: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let nextId = 6;

function generateId(): string {
  return `msg-${nextId++}`;
}

export function getMessages(filters?: { verified?: boolean; contactType?: Message["contactType"]; read?: boolean }): Message[] {
  let result = [...messages];
  if (filters) {
    if (filters.verified !== undefined) {
      result = result.filter((m) => m.verified === filters.verified);
    }
    if (filters.contactType) {
      result = result.filter((m) => m.contactType === filters.contactType);
    }
    if (filters.read !== undefined) {
      result = result.filter((m) => m.read === filters.read);
    }
  }
  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getVerifiedFeedback(): Message[] {
  return messages
    .filter((m) => m.contactType === "feedback" && m.verified && m.rating)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getVerifiedFeedbackForDisplay() {
  return getVerifiedFeedback().map((m) => ({
    id: m.id,
    name: m.name,
    location: undefined,
    quote: m.message,
    rating: m.rating!,
    createdAt: m.createdAt,
  }));
}

export function createMessage(input: MessageInput): Message {
  const msg: Message = {
    ...input,
    id: generateId(),
    verified: false,
    read: false,
    replied: false,
    createdAt: new Date().toISOString(),
  };
  messages.unshift(msg);
  return msg;
}

export function updateMessage(id: string, updates: Partial<Message>): Message | null {
  const idx = messages.findIndex((m) => m.id === id || m._id === id);
  if (idx === -1) return null;
  messages[idx] = { ...messages[idx], ...updates };
  return messages[idx];
}

export function deleteMessage(id: string): boolean {
  const idx = messages.findIndex((m) => m.id === id || m._id === id);
  if (idx === -1) return false;
  messages.splice(idx, 1);
  return true;
}

export function getMessageById(id: string): Message | null {
  return messages.find((m) => m.id === id || m._id === id) ?? null;
}

export { CONTACT_TYPE_LABELS };