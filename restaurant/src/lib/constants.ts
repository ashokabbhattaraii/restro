import type { EventItem, GalleryImage, MenuItem, Message, Reservation, StaffMember } from "@/types";

export const restaurant = {
  name: "Nepali Restaurant & Bar",
  monogram: "NR&B",
  established: "2018",
  location: "46001 As Sulaymaniyah, Iraq",
  phoneOne: "07701477472",
  phoneTwo: "07507752476",
  hours: "Mon-Sun 9:00 AM - 1:00 AM",
  cuisine: "Nepali · Indian · Chinese · Japanese Cuisine & Premium Bar",
};

export type NavChild = { href: string; label: string; description?: string };
export type NavLink = { href: string; label: string; children?: NavChild[] };

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  {
    href: "/menu",
    label: "Menu",
    children: [
      { href: "/menu#nepali", label: "Nepali", description: "Dal bhat, momo & mountain classics" },
      { href: "/menu#indian", label: "Indian", description: "Butter chicken, biryani & tandoor" },
      { href: "/menu#chinese", label: "Chinese", description: "Wok-fired plates & noodles" },
      { href: "/menu#bbq-grill", label: "BBQ & Grill", description: "Charcoal kebabs & mixed grill" },
      { href: "/menu#drinks-bar", label: "Drinks & Bar", description: "Cocktails, lassi & imported beer" },
      { href: "/menu#desserts", label: "Desserts", description: "Kheer, gulab jamun & lava cake" },
    ],
  },
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about#story", label: "Our Story", description: "A Himalayan journey since 2018" },
      { href: "/about#founder", label: "Founder", description: "Meet Arjun Tamang, our founder" },
      { href: "/about#mission", label: "Mission & Vision", description: "What drives our kitchen" },
      { href: "/about#team", label: "Meet the Team", description: "The people behind the experience" },
    ],
  },
  {
    href: "/gallery",
    label: "Gallery",
    children: [
      { href: "/gallery#food", label: "Food", description: "Signature plates up close" },
      { href: "/gallery#dining-area", label: "Dining Area", description: "Our moonlit dining room" },
      { href: "/gallery#bar", label: "Bar", description: "The premium bar counter" },
      { href: "/gallery#events", label: "Events", description: "Evenings to remember" },
    ],
  },
  {
    href: "/events",
    label: "Events",
    children: [
      { href: "/events#upcoming", label: "Upcoming Events", description: "Live music & celebrations" },
      { href: "/events#offers", label: "Special Offers", description: "Happy hour & family sets" },
    ],
  },
  { href: "/contact", label: "Contact" },
];

export const menuCategories = [
  "All",
  "Nepali",
  "Indian",
  "Chinese",
  "Japanese",
  "BBQ & Grill",
  "Drinks & Bar",
  "Desserts",
];

export const galleryFilters = ["All", "Food", "Dining Area", "Bar", "Events", "Exterior"];

export const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/reservations", label: "Reservations", icon: "CalendarCheck" },
  { href: "/admin/menu", label: "Menu", icon: "UtensilsCrossed" },
  { href: "/admin/gallery", label: "Gallery", icon: "Images" },
  { href: "/admin/events", label: "Events", icon: "PartyPopper" },
  { href: "/admin/offers", label: "Offers", icon: "Gift" },
  { href: "/admin/staff", label: "Staff", icon: "Users" },
  { href: "/admin/messages", label: "Messages", icon: "Mail" },
  { href: "/admin/settings", label: "Settings", icon: "Settings" },
];

export const images = {
  hero:
    "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=2200&q=90",
  dining:
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=90",
  bar:
    "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&w=1400&q=90",
  table:
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=90",
  kitchen:
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1400&q=90",
  exterior:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=90",
  owner:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=85",
};

export const menuItems: MenuItem[] = [
  {
    id: "dal-bhat",
    name: "Dal Bhat Set",
    category: "Nepali",
    description: "Steamed rice, lentil soup, seasonal tarkari, achar, and crisp papad.",
    price: "IQD 8,500",
    dietary: ["VEG", "HALAL"],
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1000&q=85",
    featured: true,
    visible: true,
  },
  {
    id: "momo",
    name: "Momo Steamed",
    category: "Nepali",
    description: "Hand-folded Nepali dumplings with sesame tomato achar.",
    price: "IQD 6,000",
    dietary: ["SPICY", "HALAL"],
    image:
      "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?auto=format&fit=crop&w=1000&q=85",
    featured: true,
    visible: true,
  },
  {
    id: "gundruk",
    name: "Gundruk Soup",
    category: "Nepali",
    description: "Fermented greens, tomato, garlic, and mountain herbs.",
    price: "IQD 5,000",
    dietary: ["VEG"],
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=85",
    visible: true,
  },
  {
    id: "sel-roti",
    name: "Sel Roti",
    category: "Nepali",
    description: "Crisp rice ring with cardamom and house chutney.",
    price: "IQD 4,500",
    dietary: ["VEG"],
    image:
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=1000&q=85",
    visible: true,
  },
  {
    id: "butter-chicken",
    name: "Butter Chicken",
    category: "Indian",
    description: "Tandoor chicken simmered in a velvet tomato and fenugreek sauce.",
    price: "IQD 9,000",
    dietary: ["HALAL"],
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=85",
    featured: true,
    visible: true,
  },
  {
    id: "biryani",
    name: "Biryani",
    category: "Indian",
    description: "Layered basmati rice, saffron, herbs, and raita.",
    price: "IQD 10,000",
    dietary: ["SPICY", "HALAL"],
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1000&q=85",
    visible: true,
  },
  {
    id: "palak-paneer",
    name: "Palak Paneer",
    category: "Indian",
    description: "Spinach puree, paneer, garlic, and cumin.",
    price: "IQD 8,000",
    dietary: ["VEG"],
    image:
      "https://images.unsplash.com/photo-1631292784640-2b24be784d5d?auto=format&fit=crop&w=1000&q=85",
    visible: true,
  },
  {
    id: "naan",
    name: "Naan",
    category: "Indian",
    description: "Fresh tandoor bread brushed with butter.",
    price: "IQD 2,000",
    dietary: ["VEG"],
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=85",
    visible: true,
  },
  {
    id: "kung-pao",
    name: "Kung Pao Chicken",
    category: "Chinese",
    description: "Wok-fired chicken, roasted peanuts, dried chili, and spring onion.",
    price: "IQD 9,500",
    dietary: ["SPICY", "HALAL"],
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1000&q=85",
    featured: true,
    visible: true,
  },
  {
    id: "fried-rice",
    name: "Fried Rice",
    category: "Chinese",
    description: "Jasmine rice, egg, vegetables, and soy.",
    price: "IQD 7,000",
    dietary: ["VEG"],
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=85",
    visible: true,
  },
  {
    id: "spring-rolls",
    name: "Spring Rolls",
    category: "Chinese",
    description: "Golden rolls with sweet chili dip.",
    price: "IQD 5,500",
    dietary: ["VEG"],
    image:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=85",
    visible: true,
  },
  {
    id: "hot-sour",
    name: "Hot & Sour Soup",
    category: "Chinese",
    description: "Peppery broth with mushroom, egg, and tofu.",
    price: "IQD 4,500",
    dietary: ["SPICY"],
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85",
    visible: true,
  },
  {
    id: "mixed-grill",
    name: "Himalayan Mixed Grill",
    category: "BBQ & Grill",
    description: "Charcoal-grilled kebab, tikka, fish, and spiced vegetables.",
    price: "IQD 15,000",
    dietary: ["HALAL"],
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=85",
    featured: true,
    visible: true,
  },
  {
    id: "seekh-kebab",
    name: "Seekh Kebab",
    category: "BBQ & Grill",
    description: "Minced lamb, cumin, coriander, and chili.",
    price: "IQD 8,500",
    dietary: ["SPICY", "HALAL"],
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1000&q=85",
    visible: true,
  },
  {
    id: "grilled-fish",
    name: "Grilled Fish",
    category: "BBQ & Grill",
    description: "Whole fish with lemon, garlic, and mountain herbs.",
    price: "IQD 11,000",
    dietary: ["HALAL"],
    image:
      "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=1000&q=85",
    visible: true,
  },
  {
    id: "mango-lassi",
    name: "Himalayan Mango Lassi",
    category: "Drinks & Bar",
    description: "Fresh mango, chilled yogurt, cardamom, and a saffron finish.",
    price: "IQD 3,500",
    dietary: ["VEG"],
    image:
      "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=1000&q=85",
    featured: true,
    visible: true,
  },
  {
    id: "nepali-chai",
    name: "Nepali Chai",
    category: "Drinks & Bar",
    description: "Black tea, milk, ginger, and warm spices.",
    price: "IQD 2,500",
    dietary: ["VEG"],
    image:
      "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=1000&q=85",
    visible: true,
  },
  {
    id: "cocktail",
    name: "Cocktail of the Day",
    category: "Drinks & Bar",
    description: "Bartender's seasonal gold-rimmed pour.",
    price: "IQD 7,000",
    dietary: [],
    image:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=85",
    visible: true,
  },
  {
    id: "beer",
    name: "Imported Beer",
    category: "Drinks & Bar",
    description: "A rotating selection served cold.",
    price: "IQD 5,000",
    dietary: [],
    image:
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=1000&q=85",
    visible: true,
  },
  {
    id: "kheer",
    name: "Kheer",
    category: "Desserts",
    description: "Rice pudding with cardamom, nuts, and rose.",
    price: "IQD 3,500",
    dietary: ["VEG"],
    image:
      "https://images.unsplash.com/photo-1601050690597-d11ec9c172f0?auto=format&fit=crop&w=1000&q=85",
    visible: true,
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    category: "Desserts",
    description: "Warm milk dumplings in saffron syrup.",
    price: "IQD 3,000",
    dietary: ["VEG"],
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=85",
    visible: true,
  },
  {
    id: "lava-cake",
    name: "Chocolate Lava Cake",
    category: "Desserts",
    description: "Dark chocolate center with vanilla cream.",
    price: "IQD 5,000",
    dietary: ["VEG"],
    image:
      "https://images.unsplash.com/photo-1617305855058-336d24456869?auto=format&fit=crop&w=1000&q=85",
    visible: true,
  },
];

export const events: EventItem[] = [
  {
    id: "folk-night",
    date: "Jun 14",
    time: "8:00 PM",
    title: "Live Nepali Folk Music Night",
    description: "Acoustic Himalayan melodies, shared plates, and candlelit tables.",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=85",
    type: "Live Music",
    active: true,
  },
  {
    id: "happy-hour",
    date: "Every Fri",
    time: "5:00 PM",
    title: "Friday Happy Hour",
    description: "Signature cocktails, premium bar bites, and a late-evening dining mood.",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1400&q=85",
    type: "Happy Hour",
    active: true,
  },
  {
    id: "new-year",
    date: "Apr 14",
    time: "7:30 PM",
    title: "Nepali New Year Celebration",
    description: "A festive menu inspired by home kitchens, family tables, and new beginnings.",
    image:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=85",
    type: "Festival",
    active: true,
  },
];

export const staff: StaffMember[] = [
  {
    id: "head-chef",
    name: "Head Chef",
    role: "Head Chef (Nepali)",
    department: "Kitchen",
    bio: "Expert in Nepali & Asian Cuisine. Leads the kitchen with authentic Himalayan technique.",
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=700&q=85",
    visible: true,
  },
  {
    id: "chef-2",
    name: "Chef",
    role: "Chef (Nepali)",
    department: "Kitchen",
    bio: "Specialist in Indian & Chinese dishes. Brings depth and precision to every plate.",
    image:
      "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=700&q=85",
    visible: true,
  },
  {
    id: "hookah-expert",
    name: "Hookah Expert",
    role: "Hookah Expert (Syrian)",
    department: "Service",
    bio: "Professional hookah specialist bringing authentic preparation and premium service.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=85",
    visible: true,
  },
  {
    id: "interpreters",
    name: "Interpreters",
    role: "Interpreters",
    department: "Service",
    bio: "Arabic, Kurdish, and English speakers supporting communication with guests and suppliers.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=85",
    visible: true,
  },
  {
    id: "security",
    name: "Security Team",
    role: "Security",
    department: "Operations",
    bio: "Ensuring safety and comfort for all guests, 24/7. Additional personnel on Fridays and holidays.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=85",
    visible: true,
  },
];

export const galleryImages: GalleryImage[] = [
  { id: "g1", category: "Food", title: "Dal bhat table setting", image: menuItems[0].image, shape: "tall" },
  { id: "g2", category: "Food", title: "Momo basket", image: menuItems[1].image },
  { id: "g3", category: "Dining Area", title: "Moonlit dining room", image: images.dining, shape: "wide" },
  { id: "g4", category: "Bar", title: "Premium bar counter", image: images.bar },
  { id: "g5", category: "Events", title: "Live music evening", image: events[0].image, shape: "tall" },
  { id: "g6", category: "Exterior", title: "Restaurant frontage", image: images.exterior },
  { id: "g7", category: "Food", title: "Butter chicken bowl", image: menuItems[4].image },
  { id: "g8", category: "Food", title: "Kung pao wok plate", image: menuItems[8].image, shape: "wide" },
  { id: "g9", category: "Dining Area", title: "Private table corner", image: images.table, shape: "tall" },
  { id: "g10", category: "Bar", title: "Cocktail service", image: events[1].image },
  { id: "g11", category: "Events", title: "Celebration table", image: events[2].image },
  { id: "g12", category: "Food", title: "Mixed grill platter", image: menuItems[12].image, shape: "tall" },
  { id: "g13", category: "Food", title: "Mango lassi", image: menuItems[15].image },
  { id: "g14", category: "Dining Area", title: "Chef's room detail", image: images.kitchen, shape: "wide" },
  { id: "g15", category: "Bar", title: "Backbar glow", image: menuItems[17].image },
  {
    id: "g16",
    category: "Events",
    title: "Private dinner",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=85",
    shape: "tall",
  },
  {
    id: "g17",
    category: "Dining Area",
    title: "Banquet place setting",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "g18",
    category: "Exterior",
    title: "Evening entrance",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85",
    shape: "wide",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  rating: number;
  verified?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    quote: "A rare place where the room feels elegant and the food still tastes deeply personal.",
    name: "Sara H.",
    location: "Sulaymaniyah",
    rating: 5,
  },
  {
    quote: "The momo and mixed grill are outstanding. Warm service, beautiful atmosphere, every single time.",
    name: "Omar K.",
    location: "Erbil",
    rating: 5,
  },
  {
    quote: "Our family celebration felt special from the first chai to the final dessert.",
    name: "Priya N.",
    location: "Sulaymaniyah",
    rating: 5,
  },
  {
    quote: "Easily the best Nepali food I've had outside Kathmandu. The dal bhat takes me straight home.",
    name: "Bikash R.",
    location: "Kathmandu",
    rating: 5,
  },
  {
    quote: "Cocktails at the bar are inventive and the staff treat you like a returning guest from day one.",
    name: "Layla A.",
    location: "Sulaymaniyah",
    rating: 5,
  },
  {
    quote: "We booked the live music night and it was unforgettable — gold-lit, generous, and full of warmth.",
    name: "Haval M.",
    location: "Duhok",
    rating: 5,
  },
  {
    quote: "Refined without being stiff. The butter chicken and fresh naan are worth the trip alone.",
    name: "Dilan S.",
    location: "Kirkuk",
    rating: 4,
  },
];

export const ratingSummary = {
  average: 4.9,
  count: 240,
};

export const reservations: Reservation[] = [
  { id: "r1", name: "Sara Hadi", phone: "07700000001", date: "2026-05-29", time: "7:30 PM", guests: 4, occasion: "Birthday", status: "Confirmed" },
  { id: "r2", name: "Omar Karim", phone: "07700000002", date: "2026-05-29", time: "8:00 PM", guests: 2, occasion: "Date Night", status: "Pending" },
  { id: "r3", name: "Priya N.", phone: "07700000003", date: "2026-05-30", time: "6:30 PM", guests: 6, occasion: "Family", status: "Pending" },
  { id: "r4", name: "Dara S.", phone: "07700000004", date: "2026-05-31", time: "9:00 PM", guests: 3, occasion: "Business", status: "Cancelled" },
  { id: "r5", name: "Mina A.", phone: "07700000005", date: "2026-06-01", time: "7:00 PM", guests: 5, occasion: "Anniversary", status: "Confirmed" },
];

export const messages: Message[] = [
  { id: "m1", name: "Layla", phone: "07500000001", email: "layla@example.com", subject: "Private Event", message: "Can we book the dining room for 20 guests?", contactType: "enquiry", verified: false, read: false, createdAt: "2026-05-29T09:30:00.000Z" },
  { id: "m2", name: "Haval", phone: "07500000002", email: "haval@example.com", subject: "Feedback", message: "The momo were excellent. Thank you.", contactType: "feedback", rating: 5, verified: true, read: true, replied: true, createdAt: "2026-05-28T15:10:00.000Z" },
];
