# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Production build
pnpm start        # Serve production build
pnpm lint         # ESLint (flat config, core-web-vitals + typescript)
```

## Architecture

- **Framework**: Next.js 16 (App Router) with React 19, TypeScript, Tailwind CSS 4
- **Package manager**: pnpm
- **Routing**: File-based via `app/` directory (App Router only, no Pages Router)
- **Styling**: Tailwind CSS 4 via `@tailwindcss/postcss`; global styles in `app/globals.css`
- **Path alias**: `@/*` maps to project root (e.g., `@/app/page`)

## Key Conventions

- All components in `app/` are Server Components by default; add `"use client"` directive only when needed
- Fonts loaded via `next/font/google` (Geist Sans + Geist Mono) as CSS variables
- ESLint uses flat config format (`eslint.config.mjs`) with `eslint/config` imports

## Next.js 16 — Read the Bundled Docs

This project runs Next.js 16 which may have breaking changes from older versions. Before writing routing, data fetching, or config code, consult `node_modules/next/dist/docs/` for the authoritative API reference. Key areas:
- `01-app/01-getting-started/` — project structure, layouts, pages
- `01-app/02-guides/` — patterns like instant navigation (`unstable_instant` export)
- `01-app/03-api-reference/` — component/function API details






Restaurant Name: Nepali Restaurant & Bar 🇳🇵🍽️
Established: 2018
Cuisine: Nepali, Chinese, and Indian
Location: 46001 As Sulaymaniyah, Iraq
Phone: 07701477472 / 07507752476


Master Design System (Apply to All Pages)
Design System: "Moonlit Mountain Luxury"
Theme: Ultra-premium dark luxury dining — Nepali Himalayan heritage meets high-end modern restaurant

COLORS (use these exact hex values):
- Background: #121414 (Deep Charcoal — all page backgrounds)
- Surface cards/panels: #1e2020 with backdrop-filter: blur(16px) and 20% opacity fill (Glassmorphism)
- Primary accent: #f2ca50 (Champagne Gold — borders, icons, highlights, prices)
- Gold container: #d4af37 (CTA buttons, active states)
- Body text: #e2e2e2 (Alabaster white)
- Muted text / descriptions: #d0c5af (Warm parchment)
- Card borders: 1px solid rgba(242, 202, 80, 0.30)
- Outline/dividers: #4d4635

TYPOGRAPHY:
- Headlines & display text: Playfair Display — Bold 700, tracked -0.02em
- Body / menu items / prices / descriptions: Inter — Regular 400
- Labels, nav items, category tags: Inter — Semibold 600, ALL CAPS, letter-spacing 0.1em

SPACING:
- Section padding (desktop): 64px top/bottom
- Section padding (mobile): 32px top/bottom
- Container max-width: 1280px, centered
- Card inner padding: 32px
- Component gutter: 24px

SHAPES:
- Buttons: 4px border-radius
- Cards: 8px border-radius
- Input fields: bottom-border only (1px #e2e2e2), no box border

ELEVATION/GLASSMORPHISM:
- All cards and panels: background rgba(30,32,32,0.80), backdrop-filter blur(16px), border 1px solid rgba(242,202,80,0.25)
- Modal/overlay: blur(24px), slightly lighter tint #282a2b at 85% opacity

BUTTONS:
- Primary: solid #d4af37 background, #3c2f00 charcoal text, 4px radius, 14px Inter 600 UPPERCASE
- Secondary/Ghost: transparent background, 1px solid #f2ca50 border, #e2e2e2 text
- Hover: Primary button darkens to #b8960f; Ghost fills with rgba(242,202,80,0.10)

DECORATIVE MOTIFS:
- Use geometric Himalayan patterns (rhombus lattice, diamond grids, mountain silhouette outlines) as very low-opacity watermarks (#f2ca50 at 4–6% opacity) in section backgrounds
- NO literal illustrations or cartoon graphics
- Nepal flag colors (crimson/blue) should NOT dominate — only gold and charcoal dominate; cultural identity is expressed through geometry and typography
- Thin horizontal gold hairlines (1px, 30% opacity) as section dividers

NAVIGATION BAR:
- Background: rgba(18,20,20,0.95) with backdrop-filter blur(12px)
- Logo left: "Nepali Restaurant & Bar" in Playfair Display 22px Gold, with small 🇳🇵 flag emoji
- Nav links center: Inter 600 UPPERCASE 13px letter-spacing 0.1em, color #d0c5af, gold dot (●) underline on active
- CTA right: Ghost button "Reserve a Table"
- Sticky on scroll; subtle 1px gold-bottom border appears on scroll

PAGE 1 — HOME PAGE
HERO SECTION:
- Full-viewport dark cinematic hero (1920×1080 layout)
- Background: deep dark overlay (#121414 at 80%) over a rich Nepali/Himalayan mountain landscape or moody restaurant interior photo placeholder
- Geometric Himalayan mountain silhouette as low-opacity SVG watermark (gold, 5% opacity) behind text
- Top-center: small ALL CAPS label chip — Inter 12px gold border chip reading "EST. 2018 · SULAYMANIYAH, IRAQ"
- Main headline: Playfair Display 64px Bold — "A Taste of the Himalayas" (two lines, centered)
- Sub-headline: Inter 18px #d0c5af — "Nepali · Chinese · Indian Cuisine & Premium Bar"
- Two buttons centered below: [Primary: "Reserve a Table"] [Ghost: "Explore Menu"]
- Bottom of hero: a thin 1px gold horizontal hairline, then three stat chips side by side in glassmorphic mini-cards: "Est. 2018", "3 Cuisines", "Sulaymaniyah, Iraq"

RESTAURANT INTRODUCTION SECTION:
- Two-column layout (desktop): left = large glassmorphic card with body text, right = stacked two square image placeholders
- Headline (Playfair Display 32px): "Where Himalayan Warmth Meets Refined Dining"
- Body (Inter 16px #d0c5af): Introduce the restaurant warmly — "Nestled in the heart of As Sulaymaniyah, Nepali Restaurant & Bar brings the rich flavors of Nepal, India, and China together in one extraordinary dining destination. Since 2018, we have been serving our guests authentic cuisine, crafted with tradition and love."
- Gold hairline left-border on the text block

FEATURED DISHES SECTION:
- Section label (chip): "OUR SIGNATURES"
- Headline: "Crafted with Tradition"
- 3-column card grid (desktop), horizontal scroll (mobile)
- Each dish card: glassmorphic panel, food image placeholder top, Playfair Display dish name, Inter 14px description #d0c5af, Inter 16px Gold price, Ghost "View Menu" button
- Featured dishes to show: Dal Bhat Set, Momo (Nepali dumplings), Butter Chicken, Kung Pao Chicken, Himalayan Mixed Grill, Mango Lassi

RESERVATION CTA SECTION:
- Full-width dark section with subtle geometric diamond watermark
- Centered: Playfair Display 40px headline — "Book Your Table Tonight"
- Inter 16px subtext — "Reservations available 7 days a week. Call us or book online."
- Primary button: "Make a Reservation"
- Below button: two phone numbers shown as gold text — 📞 07701477472 · 07507752476

EVENTS PREVIEW SECTION:
- Section label: "UPCOMING EVENTS"
- Headline: "Evenings to Remember"
- 3 horizontal glassmorphic event cards — each with: date chip (gold bordered), event title Playfair Display, short Inter description, Ghost "Learn More" button
- Placeholder events: "Live Nepali Folk Music Night", "Friday Happy Hour", "Nepali New Year Celebration"

CUSTOMER TESTIMONIALS SECTION:
- Dark section with mountain watermark
- Headline: "What Our Guests Say"
- 3 glassmorphic quote cards, each with: quote text in Playfair Display italic 20px, guest name Inter 14px gold, 5-star gold rating (★★★★★)

GALLERY PREVIEW SECTION:
- Section label: "GALLERY"
- Asymmetric 5-image mosaic grid: one large left image, 4 smaller right grid (2×2)
- Overlay hover: gold tint + "View Gallery" label
- Ghost CTA button below grid: "Explore Full Gallery"

FOOTER:
- 4-column layout: [Logo + tagline + social icons] [Quick Links] [Opening Hours] [Contact Info]
- Logo: Playfair Display Gold
- Social icons: Instagram, Facebook, WhatsApp — gold outline circle icons
- Address: 46001 As Sulaymaniyah, Iraq
- Phone: 07701477472 / 07507752476
- Hours: Mon–Sun 11:00 AM – 11:00 PM (example)
- Bottom bar: 1px gold divider, then "© 2024 Nepali Restaurant & Bar · All Rights Reserved" centered, Inter 12px #99907c

PAGE 2 — MENU PAGE
PAGE HERO:
- Compact hero (400px height), centered
- Background: dark charcoal with geometric Himalayan lattice watermark
- Breadcrumb: Home > Menu (Inter 12px #99907c)
- Headline: Playfair Display 48px "Our Menu"
- Subtext: "Authentic flavors from Nepal, India & China"

CATEGORY NAVIGATION (sticky tabs below hero):
- Horizontal tab bar: glassmorphic background, centered tabs
- Categories (ALL CAPS Inter 13px chips): ALL · NEPALI · INDIAN · CHINESE · BBQ & GRILL · DRINKS & BAR · DESSERTS
- Active tab: gold bottom-border 2px, gold text
- Inactive: #99907c text

MENU GRID SECTIONS (one per category):
- Category section title: Playfair Display 28px left-aligned, with thin 1px gold left-border accent
- 2-column card grid (desktop), 1-column (mobile)
- Each menu item card: glassmorphic panel, food image placeholder left (80px × 80px rounded 4px), right side: dish name Playfair Display 18px, description Inter 14px #d0c5af 2 lines, dietary chips (VEG / SPICY / HALAL — small gold-bordered uppercase chips), price Inter 18px Gold right-aligned
- Dotted gold connector line between item name and price (traditional menu layout)

SAMPLE ITEMS TO POPULATE:
Nepali: Dal Bhat (IQD 8,500), Momo Steamed (IQD 6,000), Gundruk Soup (IQD 5,000), Sel Roti (IQD 4,500)
Indian: Butter Chicken (IQD 9,000), Biryani (IQD 10,000), Palak Paneer (IQD 8,000), Naan (IQD 2,000)
Chinese: Kung Pao Chicken (IQD 9,500), Fried Rice (IQD 7,000), Spring Rolls (IQD 5,500), Hot & Sour Soup (IQD 4,500)
BBQ: Mixed Grill Platter (IQD 15,000), Seekh Kebab (IQD 8,500), Grilled Fish (IQD 11,000)
Drinks & Bar: Himalayan Mango Lassi (IQD 3,500), Nepali Chai (IQD 2,500), Cocktail of the Day (IQD 7,000), Imported Beer (IQD 5,000)
Desserts: Kheer (IQD 3,500), Gulab Jamun (IQD 3,000), Chocolate Lava Cake (IQD 5,000)

RESERVATION CTA STRIP:
- Thin full-width strip: dark glassmorphic, centered text — "Ready to dine? Reserve your table now." + Primary button

PAGE 3 — ABOUT US PAGE
PAGE HERO:
- Same compact hero style
- Headline: "Our Story"
- Subtext: "A Himalayan journey that began in 2018"

RESTAURANT HISTORY SECTION:
- Two-column: left large image placeholder (restaurant interior), right text block
- Headline: Playfair Display 32px "From the Mountains to Your Table"
- Body: founding story, Nepali cultural inspiration, how the restaurant brings three cuisines together under one roof
- Timeline: 3 horizontal glassmorphic milestone cards (2018 — Founded, 2020 — Bar Expansion, 2023 — Cultural Events Launch)

MISSION & VISION:
- Two side-by-side glassmorphic cards
- Mission card: gold icon (◆), Playfair Display headline "Our Mission", Inter body text
- Vision card: gold icon (◇), Playfair Display headline "Our Vision", Inter body text

OWNER MESSAGE:
- Full-width dark section with subtle geometric watermark
- Large circular owner photo placeholder (200px), name Playfair Display 24px Gold, title Inter 14px uppercase
- Quote block: Playfair Display italic 22px, indented with 3px left gold bar
- "Welcome to our family. Every dish we serve carries the heart of Nepal..." etc.

TEAM INTRODUCTION:
- Section label: "MEET OUR TEAM"
- Headline: "The People Behind the Experience"
- 4-column card grid: each card glassmorphic, circular staff photo placeholder 120px, name Playfair Display 18px, role Inter 13px GOLD UPPERCASE, short bio Inter 14px #d0c5af
- Roles: Head Chef, Sous Chef, Bar Manager, Front of House Manager

NEPALI CULTURAL SECTION:
- 2-column: text left, decorative geometric Himalayan SVG pattern right (gold line art, abstract mountains)
- Headline: "Inspired by Nepal"
- Body about Nepali culture, hospitality, and how it infuses the dining experience

PAGE 4 — GALLERY PAGE
PAGE HERO: same compact style — "Gallery" / "A Visual Journey"

FILTER TABS (sticky): ALL · FOOD · DINING AREA · BAR · EVENTS · EXTERIOR

MASONRY GRID LAYOUT:
- Pinterest-style masonry grid, 3 columns desktop / 2 tablet / 1 mobile
- Mix of portrait and landscape image placeholders
- Hover state: gold overlay tint (#f2ca50 at 15%), gold border 1px appears, zoom icon center
- Images labeled by category with small gold chip overlay (bottom-left of each image)
- Lightbox click behavior: darkened full-screen overlay with glassmorphic image frame, prev/next navigation arrows (gold), ESC close

TOTAL PLACEHOLDER IMAGES: 18 (6 food, 4 dining area, 3 bar, 3 events, 2 exterior)

PAGE 5 — EVENTS & OFFERS PAGE
PAGE HERO: "Events & Offers" / "Celebrate with Us"

UPCOMING EVENTS SECTION:
- Headline: "Upcoming Events"
- Large card layout (1 featured event full-width, then 2-column grid below)
- Featured event card: glassmorphic wide card, event banner image placeholder left 40%, right 60% = date chip (gold border), event name Playfair Display 28px, description Inter 16px, "Get Notified" ghost button
- Grid cards: same structure but compact

SPECIAL OFFERS SECTION:
- Section label: "CURRENT OFFERS"
- 3 glassmorphic offer cards with bold gold percentage text (e.g., "20% OFF"), offer description, validity date chip, T&C Inter 12px muted
- Placeholder offers: Happy Hour (5–8 PM daily), Weekend Family Set, Birthday Special

PAST EVENTS (collapsed accordion or horizontal scroll):
- 4 small past event cards with date, title, muted style (#99907c text)

PAGE 6 — RESERVATION PAGE
PAGE HERO: "Reserve a Table" / "We look forward to welcoming you"

RESERVATION FORM (center, max-width 640px):
- Glassmorphic form panel, 8px radius, gold 1px border
- Form title: Playfair Display 28px
- Fields (minimalist bottom-border only style, Inter labels UPPERCASE 12px above each field):
  · Full Name (text)
  · Phone Number (tel)
  · Email Address (email)
  · Date (date picker — styled to match dark theme)
  · Time (time selector — 11:00 AM to 11:00 PM in 30-min steps)
  · Number of Guests (selector: 1–20+)
  · Occasion (optional chips: Birthday · Anniversary · Business · Date Night · Other)
  · Special Requests (textarea, 3 rows)
- Primary CTA button full-width: "Confirm Reservation"
- Below form: gold info strip — "Or call us directly: 07701477472 · 07507752476"

OPENING HOURS SIDEBAR (desktop only, right column):
- Glassmorphic card
- Daily hours listed Inter 14px, gold dot before each day
- "We recommend reservations for weekends"

PAGE 7 — CONTACT PAGE
PAGE HERO: "Contact Us" / "We'd love to hear from you"

TWO-COLUMN LAYOUT:
LEFT COLUMN — Contact Details:
- Glassmorphic card
- Each contact item as a row: gold icon + label (UPPERCASE Inter 12px) + value (Inter 16px #e2e2e2)
  · 📍 Address: 46001 As Sulaymaniyah, Iraq
  · 📞 Phone 1: 07701477472
  · 📞 Phone 2: 07507752476
  · 💬 WhatsApp: tap-to-chat link (gold button)
  · 📸 Instagram: link
  · 📘 Facebook: link
- 1px gold divider between items

RIGHT COLUMN — Contact Form:
- Same minimalist bottom-border field style
- Fields: Name, Phone, Email, Subject (dropdown), Message (textarea)
- Primary CTA: "Send Message"

GOOGLE MAPS EMBED SECTION (full-width below columns):
- Dark-styled embedded Google Map (use dark map style or overlay)
- Glassmorphic overlay card top-left of map with address and "Get Directions" gold button
- Map pin location: As Sulaymaniyah, Iraq

PAGE 8 — ADMIN DASHBOARD (internal, authenticated)
SIDEBAR NAVIGATION (260px width):
- Background: #0c0f0f
- Top: Restaurant logo + "Admin Panel" label
- Nav items (Inter 14px, icon + label): Dashboard, Reservations, Menu Management, Gallery, Events, Staff, Messages, Settings
- Active item: gold left-border 3px + gold text
- Bottom: Avatar + logout button

DASHBOARD HOME:
- 4 stat cards top row: Total Reservations Today / Pending Confirmations / Menu Items / Unread Messages
- Each glassmorphic card: large Playfair Display number in gold, Inter 14px label below

RESERVATIONS TABLE:
- Dark table: alternating row shades #1a1c1c / #1e2020
- Columns: Name, Date, Time, Guests, Status (chip: Confirmed=gold, Pending=amber, Cancelled=red-muted), Actions (Confirm | Cancel buttons)
- Search bar top: minimalist bottom-border style

MENU MANAGEMENT:
- List view with inline edit
- "Add New Item" primary button top-right
- Each row: food image thumbnail 48px, name, category chip, price, visibility toggle switch (gold when ON), edit / delete actions

GALLERY MANAGEMENT:
- Drag-and-drop image grid
- "Upload Images" primary button
- Each image: small thumbnail, delete overlay on hover (X in gold)

STAFF MANAGEMENT:
- Card grid: circular photo 80px, name, role, visibility toggle, edit button

MESSAGES VIEW:
- Two-pane layout: message list left, message detail right
- Unread messages: gold dot indicator

GLOBAL MICRO-INTERACTIONS & ANIMATION NOTES
- Hero text: fade-in-up animation, 0.8s ease, staggered per line
- Cards: subtle upward float on hover (translateY -4px, 0.3s ease)
- Navigation: smooth scroll behavior
- Page transitions: fade in 0.4s
- Gold dot nav indicator: smooth slide transition
- Glassmorphic cards: border opacity increases from 25% → 45% on hover
- Buttons: slight scale(1.02) on hover, 0.2s ease
- Section reveals: intersection observer fade-up as user scrolls
- Menu category tab switch: smooth underline slide animation
- No jarring flash animations — everything should feel calm, slow, and luxurious

This prompt fully covers all 8 pages, the admin dashboard, and every UI component — all grounded in the Moonlit Mountain Luxury design system from the .md file and the full feature requirements from the .docx. Paste this directly into Stitch and it should generate every section in the correct dark glassmorphic gold aesthetic.