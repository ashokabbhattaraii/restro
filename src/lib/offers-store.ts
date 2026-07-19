import type { OfferItem } from "@/types";

const defaultOffers: OfferItem[] = [
  { id: "happy-hour", pct: "20%", unit: "OFF", title: "Happy Hour", description: "Daily bar pours and selected snacks from 5–8 PM. Join us for the golden hour.", validity: "Valid Daily · 5:00 PM – 8:00 PM", cta: "Reserve a Spot", active: true, sortOrder: 0 },
  { id: "weekend-set", pct: "Set", unit: "Menu", title: "Weekend Family Set", description: "A generous shared menu for four or more guests — the ideal weekend tradition.", validity: "Valid Sat & Sun", cta: "Book a Table", active: true, sortOrder: 1 },
  { id: "birthday", pct: "Free", unit: "Gift", title: "Birthday Special", description: "Complimentary cake plating and Nepali chai for birthday tables. Let us celebrate you.", validity: "With advance booking", cta: "Book Now", active: true, sortOrder: 2 },
];

let offers: OfferItem[] = [...defaultOffers];

export function getOffers(activeOnly = false): OfferItem[] {
  if (activeOnly) return offers.filter((o) => o.active).sort((a, b) => a.sortOrder - b.sortOrder);
  return [...offers];
}

export function createOffer(data: Omit<OfferItem, "id">): OfferItem {
  const offer = { ...data, id: crypto.randomUUID() };
  offers.push(offer);
  return offer;
}

export function updateOffer(id: string, data: Partial<OfferItem>): OfferItem | null {
  const idx = offers.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  offers[idx] = { ...offers[idx], ...data };
  return offers[idx];
}

export function deleteOffer(id: string): boolean {
  const len = offers.length;
  offers = offers.filter((o) => o.id !== id);
  return offers.length < len;
}
