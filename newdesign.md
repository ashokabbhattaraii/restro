---
version: alpha
name: "Fastos Bold Burger"
description: "Typography baseline relies on Montserrat for hero banner headline — maximum visual impact, all-caps treatment."
colors:
  brand-red: "#ec3333"
  linen: "#faf3eb"
  white: "#ffffff"
  brand-orange: "#ff8a00"
  near-black: "#222222"
  paragraph-gray: "#767676"
  primary-dark: "#262626"
  light-border: "#e4e4e4"
typography:
  hero-display:
    fontFamily: "Montserrat"
    fontSize: "90px"
    fontWeight: "900"
    lineHeight: "99px"
    letterSpacing: "1.6px"
  section-heading-xl:
    fontFamily: "Montserrat"
    fontSize: "70px"
    fontWeight: "900"
    lineHeight: "84px"
  section-heading-lg:
    fontFamily: "Montserrat"
    fontSize: "45px"
    fontWeight: "900"
    lineHeight: "54px"
  section-heading-md:
    fontFamily: "Montserrat"
    fontSize: "30px"
    fontWeight: "900"
    lineHeight: "36px"
  section-heading-sm:
    fontFamily: "Montserrat"
    fontSize: "25px"
    fontWeight: "900"
    lineHeight: "30px"
  nav-button-label:
    fontFamily: "Montserrat"
    fontSize: "16px"
    fontWeight: "600"
    lineHeight: "14.4px"
    letterSpacing: "1.6px"
  body-text:
    fontFamily: "Lato"
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "16px"
  subheading-medium:
    fontFamily: "Montserrat"
    fontSize: "16px"
    fontWeight: "500"
    lineHeight: "22.4px"
  price-badge:
    fontFamily: "Montserrat"
    fontSize: "24px"
    fontWeight: "900"
    lineHeight: "33.6px"
rounded:
  button: "10px"
  card: "10px"
  tag: "4px"
  pill: "50px"
spacing:
  xs: "5px"
  sm: "8px"
  md-sm: "10px"
  md: "15px"
  nav-padding: "20px"
  lg: "24px"
  xl: "30px"
  2xl: "40px"
  3xl: "50px"
  4xl: "60px"
  5xl: "90px"
  section: "130px"
---

## Overview

Typography baseline relies on Montserrat for hero banner headline — maximum visual impact, all-caps treatment.

This system uses a 5px base grid with scale values 5, 8, 10, 15, 20, 24, 30, 40, 50, 60, 90, 130.

**Signature traits:**
- Core token rhythm: Token evidence indicates consistent color, spacing, and radius rhythm across visible UI.

## Colors

The palette uses 8 validated color tokens across 1 theme profile. Semantic roles stay attached to observed usage so generation agents can choose accents without inventing new color meaning.

**Semantic naming:**
- **action-text** maps to `primary-dark`: Role "text" is grounded by usage context "Primary body text, nav links, footer text — dominant text color across the entire site".
- **action-background** maps to `white`: Role "background" is grounded by usage context "Navbar background, hero overlay text, card surfaces, button text on red backgrounds".
- **content-text** maps to `brand-orange`: Role "text" is grounded by usage context "Logo text color, section headings, starburst price badge fill, highlight labels".
- **surface-background** maps to `linen`: Role "background" is grounded by usage context "Warm off-white section backgrounds, subtle content area fills".

### Text Scale
- **Brand Orange** (#ff8a00): Logo text color, section headings, starburst price badge fill, highlight labels. Role: text. {authored: rgb(255, 138, 0), space: rgb}
- **Near Black** (#222222): Heading text, nav item text, strong foreground elements. Role: text. {authored: rgb(34, 34, 34), space: rgb}
- **Paragraph Gray** (#767676): Secondary body copy, captions, supporting descriptive text. Role: text. {authored: rgb(118, 118, 118), space: rgb}
- **Primary Dark** (#262626): Primary body text, nav links, footer text — dominant text color across the entire site. Role: text. {authored: rgb(38, 38, 38), space: rgb}

### Interactive
- **Light Border** (#e4e4e4): Dividers, card borders, subtle separators. Role: border. {authored: rgb(228, 228, 228), space: rgb}

### Surface & Shadows
- **Brand Red** (#ec3333): Primary CTA buttons, navbar bottom border, logo accent, badge fills, link highlights. Role: background. {authored: rgb(236, 51, 51), space: rgb}
- **Linen** (#faf3eb): Warm off-white section backgrounds, subtle content area fills. Role: background. {authored: rgb(250, 243, 235), space: rgb}
- **White** (#ffffff): Navbar background, hero overlay text, card surfaces, button text on red backgrounds. Role: background. {authored: rgb(255, 255, 255), space: rgb, alpha: 0.15}

## Typography

Typography uses Montserrat, Lato across extracted hierarchy roles. Keep hierarchy mapped to these token rows before adding decorative type styles.

Mixes Montserrat and Lato for visual contrast. Weight range spans bold, semi-bold, regular, medium. Sizes range from 16px to 90px.

### Font Roles
- **Headline Font**: Montserrat
- **Body Font**: Montserrat

### Type Scale Evidence
| Role | Font | Size | Weight | Line Height | Letter Spacing | Stack / Features | Notes |
|------|------|------|--------|-------------|----------------|------------------|-------|
| Hero banner headline — maximum visual impact, all-caps treatment | Montserrat | 90px | 900 | 99px | 1.6px | Montserrat, sans-serif | Extracted token |
| Large section titles | Montserrat | 70px | 900 | 84px | normal | Montserrat, sans-serif | Extracted token |
| Primary section headings | Montserrat | 45px | 900 | 54px | normal | Montserrat, sans-serif | Extracted token |
| Card and subsection headings | Montserrat | 30px | 900 | 36px | normal | Montserrat, sans-serif | Extracted token |
| Small headings and card titles | Montserrat | 25px | 900 | 30px | normal | Montserrat, sans-serif | Extracted token |
| Navigation links, CTA button text, uppercase labels — tracked out for legibility | Montserrat | 16px | 600 | 14.4px | 1.6px | Montserrat, sans-serif | Extracted token |
| Primary body copy, descriptions, paragraph text | Lato | 16px | 400 | 16px | normal | Lato, sans-serif | Extracted token |
| Supporting subheadings, card subtitles | Montserrat | 16px | 500 | 22.4px | normal | Montserrat, sans-serif | Extracted token |
| Price callouts, starburst badge text | Montserrat | 24px | 900 | 33.6px | normal | Montserrat, sans-serif | Extracted token |

## Layout

Layout rhythm is inferred from spacing tokens and responsive breakpoint evidence.

### Spacing System
| Token | Value | Px | Notes |
|------|-------|----|-------|
| xs | 5px | 5 | Extracted spacing token |
| sm | 8px | 8 | Extracted spacing token |
| md-sm | 10px | 10 | Extracted spacing token |
| md | 15px | 15 | Extracted spacing token |
| nav-padding | 20px | 20 | Extracted spacing token |
| lg | 24px | 24 | Extracted spacing token |
| xl | 30px | 30 | Extracted spacing token |
| 2xl | 40px | 40 | Extracted spacing token |
| 3xl | 50px | 50 | Extracted spacing token |
| 4xl | 60px | 60 | Extracted spacing token |
| 5xl | 90px | 90 | Extracted spacing token |
| section | 130px | 130 | Extracted spacing token |

## Elevation & Depth

Keep depth flat unless validated shadow or interaction evidence appears in the extraction payload. Do not invent shadows beyond this evidence boundary.

### Shadow Evidence
| Shadow Token | Layers | Details |
|--------------|--------|---------|
| card-shadow | 1 | 0px 0px 10px 0px rgba(0, 65, 91, 0.1) |

### Interaction Signals
| Theme | Signal | Evidence |
|-------|--------|----------|
| Light | outline-color | rgb(38, 38, 38) ; rgb(255, 255, 255) ; rgb(34, 34, 34) |
| Light | outline-width | 3px |
| Light | outline-offset | 0px |
| Light | transform | matrix(1, 0, 0, 1, 0, 0) ; matrix(0.146124, 0.989266, -0.989266, 0.146124, 0, 0) ; matrix(0.992546, 0.121869, -0.121869, 0.992546, 0, 0) |

## Shapes

Shape language maps directly to rounded tokens. Keep component corners consistent with the role mapping below before introducing bespoke geometry.

### Radius Roles
| Token | Value | Px | Role Mapping |
|------|-------|----|--------------|
| tag | 4px | 4 | Subtle corner |
| button | 10px | 10 | Control corner |
| pill | 50px | 50 | Large surface corner |

### Geometry Evidence
| Radius Token | Shape | Units |
|--------------|-------|-------|
| button | 10px | px |
| card | 10px | px |
| tag | 4px | px |
| pill | 50px | px |

## Components

(none detected)

## Do's and Don'ts

Guardrails protect Core token rhythm without adding unsupported visual claims.

| Do | Don't |
|----|---------|
| Do maintain consistent spacing using the base grid | Don't make unsupported claims about absent visual features |
| Do maintain WCAG AA contrast ratios (4.5:1 for normal text) | Don't mix rounded and sharp corners in the same view |
| Do use the primary color only for the single most important action per screen |  |
| Do verify evidence before writing new design-system guidance |  |

## Responsive Evidence

### Breakpoints

No distinct responsive breakpoints were extracted.

## Agent Prompt Guide

### Example Component Prompts
- Create button component using validated primary color role and spacing tokens.
- Create card component with mapped radius role and evidence-backed elevation.
- Create form input component using inferred typography hierarchy and border roles.

### Iteration Guide
1. Start with extracted palette and typography roles only.
2. Map spacing and radius directly from token tables before visual polish.
3. Apply component patterns one section at a time and compare against source intent.
4. Keep elevation claims tied to explicit evidence in output.
5. Iterate with smallest diffs and re-check section hierarchy after each change.




@theme {
  /* Colors */
  --color-primary-dark: #262626;
  --color-white: #ffffff;
  --color-brand-red: #ec3333;
  --color-brand-orange: #ff8a00;
  --color-paragraph-gray: #767676;
  --color-near-black: #222222;
  --color-linen: #faf3eb;
  --color-light-border: #e4e4e4;

  /* Spacing */
  --spacing-xs: 5px;
  --spacing-sm: 8px;
  --spacing-md-sm: 10px;
  --spacing-md: 15px;
  --spacing-nav-padding: 20px;
  --spacing-lg: 24px;
  --spacing-xl: 30px;
  --spacing-2xl: 40px;
  --spacing-3xl: 50px;
  --spacing-4xl: 60px;
  --spacing-5xl: 90px;
  --spacing-section: 130px;

  /* Border Radius */
  --radius-button: 10px;
  --radius-card: 10px;
  --radius-tag: 4px;
  --radius-pill: 50px;

  /* Fonts */
  --font-montserrat: "Montserrat", sans-serif;
  --font-lato: "Lato", sans-serif;

}



:root {
  /* Colors */
  --color-primary-dark: #262626;
  --color-white: #ffffff;
  --color-brand-red: #ec3333;
  --color-brand-orange: #ff8a00;
  --color-paragraph-gray: #767676;
  --color-near-black: #222222;
  --color-linen: #faf3eb;
  --color-light-border: #e4e4e4;

  /* Typography */
  --font-hero-display-family: Montserrat;
  --font-hero-display-size: 90px;
  --font-hero-display-weight: 900;
  --font-hero-display-line-height: 99px;
  --font-hero-display-letter-spacing: 1.6px;
  --font-section-heading-xl-family: Montserrat;
  --font-section-heading-xl-size: 70px;
  --font-section-heading-xl-weight: 900;
  --font-section-heading-xl-line-height: 84px;
  --font-section-heading-lg-family: Montserrat;
  --font-section-heading-lg-size: 45px;
  --font-section-heading-lg-weight: 900;
  --font-section-heading-lg-line-height: 54px;
  --font-section-heading-md-family: Montserrat;
  --font-section-heading-md-size: 30px;
  --font-section-heading-md-weight: 900;
  --font-section-heading-md-line-height: 36px;
  --font-section-heading-sm-family: Montserrat;
  --font-section-heading-sm-size: 25px;
  --font-section-heading-sm-weight: 900;
  --font-section-heading-sm-line-height: 30px;
  --font-nav-/-button-label-family: Montserrat;
  --font-nav-/-button-label-size: 16px;
  --font-nav-/-button-label-weight: 600;
  --font-nav-/-button-label-line-height: 14.4px;
  --font-nav-/-button-label-letter-spacing: 1.6px;
  --font-body-text-family: Lato;
  --font-body-text-size: 16px;
  --font-body-text-weight: 400;
  --font-body-text-line-height: 16px;
  --font-subheading-medium-family: Montserrat;
  --font-subheading-medium-size: 16px;
  --font-subheading-medium-weight: 500;
  --font-subheading-medium-line-height: 22.4px;
  --font-price-/-badge-family: Montserrat;
  --font-price-/-badge-size: 24px;
  --font-price-/-badge-weight: 900;
  --font-price-/-badge-line-height: 33.6px;

  /* Spacing */
  --spacing-xs: 5px;
  --spacing-sm: 8px;
  --spacing-md-sm: 10px;
  --spacing-md: 15px;
  --spacing-nav-padding: 20px;
  --spacing-lg: 24px;
  --spacing-xl: 30px;
  --spacing-2xl: 40px;
  --spacing-3xl: 50px;
  --spacing-4xl: 60px;
  --spacing-5xl: 90px;
  --spacing-section: 130px;

  /* Border Radius */
  --radius-button: 10px;
  --radius-card: 10px;
  --radius-tag: 4px;
  --radius-pill: 50px;

}




{
  "color": {
    "Primary Dark": {
      "$type": "color",
      "$value": "#262626",
      "$description": "Primary body text, nav links, footer text — dominant text color across the entire site"
    },
    "White": {
      "$type": "color",
      "$value": "#ffffff",
      "$description": "Navbar background, hero overlay text, card surfaces, button text on red backgrounds"
    },
    "Brand Red": {
      "$type": "color",
      "$value": "#ec3333",
      "$description": "Primary CTA buttons, navbar bottom border, logo accent, badge fills, link highlights"
    },
    "Brand Orange": {
      "$type": "color",
      "$value": "#ff8a00",
      "$description": "Logo text color, section headings, starburst price badge fill, highlight labels"
    },
    "Paragraph Gray": {
      "$type": "color",
      "$value": "#767676",
      "$description": "Secondary body copy, captions, supporting descriptive text"
    },
    "Near Black": {
      "$type": "color",
      "$value": "#222222",
      "$description": "Heading text, nav item text, strong foreground elements"
    },
    "Linen": {
      "$type": "color",
      "$value": "#faf3eb",
      "$description": "Warm off-white section backgrounds, subtle content area fills"
    },
    "Light Border": {
      "$type": "color",
      "$value": "#e4e4e4",
      "$description": "Dividers, card borders, subtle separators"
    }
  },
  "typography": {
    "Hero Display": {
      "$type": "typography",
      "$value": {
        "fontFamily": "Montserrat",
        "fontSize": "90px",
        "fontWeight": 900,
        "lineHeight": "99px",
        "letterSpacing": "1.6px"
      },
      "$description": "Hero banner headline — maximum visual impact, all-caps treatment"
    },
    "Section Heading XL": {
      "$type": "typography",
      "$value": {
        "fontFamily": "Montserrat",
        "fontSize": "70px",
        "fontWeight": 900,
        "lineHeight": "84px",
        "letterSpacing": "normal"
      },
      "$description": "Large section titles"
    },
    "Section Heading LG": {
      "$type": "typography",
      "$value": {
        "fontFamily": "Montserrat",
        "fontSize": "45px",
        "fontWeight": 900,
        "lineHeight": "54px",
        "letterSpacing": "normal"
      },
      "$description": "Primary section headings"
    },
    "Section Heading MD": {
      "$type": "typography",
      "$value": {
        "fontFamily": "Montserrat",
        "fontSize": "30px",
        "fontWeight": 900,
        "lineHeight": "36px",
        "letterSpacing": "normal"
      },
      "$description": "Card and subsection headings"
    },
    "Section Heading SM": {
      "$type": "typography",
      "$value": {
        "fontFamily": "Montserrat",
        "fontSize": "25px",
        "fontWeight": 900,
        "lineHeight": "30px",
        "letterSpacing": "normal"
      },
      "$description": "Small headings and card titles"
    },
    "Nav / Button Label": {
      "$type": "typography",
      "$value": {
        "fontFamily": "Montserrat",
        "fontSize": "16px",
        "fontWeight": 600,
        "lineHeight": "14.4px",
        "letterSpacing": "1.6px"
      },
      "$description": "Navigation links, CTA button text, uppercase labels — tracked out for legibility"
    },
    "Body Text": {
      "$type": "typography",
      "$value": {
        "fontFamily": "Lato",
        "fontSize": "16px",
        "fontWeight": 400,
        "lineHeight": "16px",
        "letterSpacing": "normal"
      },
      "$description": "Primary body copy, descriptions, paragraph text"
    },
    "Subheading Medium": {
      "$type": "typography",
      "$value": {
        "fontFamily": "Montserrat",
        "fontSize": "16px",
        "fontWeight": 500,
        "lineHeight": "22.4px",
        "letterSpacing": "normal"
      },
      "$description": "Supporting subheadings, card subtitles"
    },
    "Price / Badge": {
      "$type": "typography",
      "$value": {
        "fontFamily": "Montserrat",
        "fontSize": "24px",
        "fontWeight": 900,
        "lineHeight": "33.6px",
        "letterSpacing": "normal"
      },
      "$description": "Price callouts, starburst badge text"
    }
  },
  "spacing": {
    "xs": {
      "$type": "dimension",
      "$value": "5px"
    },
    "sm": {
      "$type": "dimension",
      "$value": "8px"
    },
    "md-sm": {
      "$type": "dimension",
      "$value": "10px"
    },
    "md": {
      "$type": "dimension",
      "$value": "15px"
    },
    "nav-padding": {
      "$type": "dimension",
      "$value": "20px"
    },
    "lg": {
      "$type": "dimension",
      "$value": "24px"
    },
    "xl": {
      "$type": "dimension",
      "$value": "30px"
    },
    "2xl": {
      "$type": "dimension",
      "$value": "40px"
    },
    "3xl": {
      "$type": "dimension",
      "$value": "50px"
    },
    "4xl": {
      "$type": "dimension",
      "$value": "60px"
    },
    "5xl": {
      "$type": "dimension",
      "$value": "90px"
    },
    "section": {
      "$type": "dimension",
      "$value": "130px"
    }
  },
  "borderRadius": {
    "button": {
      "$type": "dimension",
      "$value": "10px"
    },
    "card": {
      "$type": "dimension",
      "$value": "10px"
    },
    "tag": {
      "$type": "dimension",
      "$value": "4px"
    },
    "pill": {
      "$type": "dimension",
      "$value": "50px"
    }
  }
}


