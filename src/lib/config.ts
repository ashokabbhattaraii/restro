export type DayHours = {
  open: string;
  close: string;
  closed: boolean;
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
};

export const DEFAULT_CONFIG: RestaurantConfig = {
  acceptingReservations: true,
  maxGuests: 20,
  maxDaysAhead: 30,
  slotIntervalMinutes: 30,
  hours: {
    Monday: { open: "11:00", close: "23:00", closed: false },
    Tuesday: { open: "11:00", close: "23:00", closed: false },
    Wednesday: { open: "11:00", close: "23:00", closed: false },
    Thursday: { open: "11:00", close: "23:00", closed: false },
    Friday: { open: "11:00", close: "23:00", closed: false },
    Saturday: { open: "11:00", close: "23:00", closed: false },
    Sunday: { open: "11:00", close: "23:00", closed: false },
  },
  closedDates: [],
  phoneOne: "07701477472",
  phoneTwo: "07507752476",
  location: "46001 As Sulaymaniyah, Iraq",
  message: "",
};
