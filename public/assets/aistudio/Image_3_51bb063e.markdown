---
name: Shopee Marketplace Desktop
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#5b403b'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#8f7069'
  outline-variant: '#e3beb6'
  surface-tint: '#b62506'
  primary: '#b22204'
  on-primary: '#ffffff'
  primary-container: '#d63c1e'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a4'
  secondary: '#b02f00'
  on-secondary: '#ffffff'
  secondary-container: '#ff5722'
  on-secondary-container: '#541100'
  tertiary: '#785600'
  on-tertiary: '#ffffff'
  tertiary-container: '#976d00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad3'
  primary-fixed-dim: '#ffb4a4'
  on-primary-fixed: '#3e0500'
  on-primary-fixed-variant: '#8d1600'
  secondary-fixed: '#ffdbd1'
  secondary-fixed-dim: '#ffb5a0'
  on-secondary-fixed: '#3b0900'
  on-secondary-fixed-variant: '#862200'
  tertiary-fixed: '#ffdea6'
  tertiary-fixed-dim: '#ffbb0c'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5d4200'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e3e2e2'
  page-canvas: '#F5F5F5'
  surface-white: '#FFFFFF'
  deal-crimson: '#D0011B'
  discount-badge-bg: '#FFE97A'
  discount-badge-text: '#EE4D2D'
  mall-red: '#D0011B'
  rating-star: '#FFCE3D'
  border-subtle: '#EBEBEB'
  text-primary: '#222222'
  text-secondary: '#757575'
  flash-sale-black: '#000000'
typography:
  display-hero:
    fontFamily: Work Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-section:
    fontFamily: Work Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  title-card:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  price-headline:
    fontFamily: Work Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
  price-card:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
  price-original:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  body-default:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-compact:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-badge:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.02em
  label-micro:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 12px
  countdown-digit:
    fontFamily: Work Sans
    fontSize: 15px
    fontWeight: '700'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.625rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system captures the dynamic, high-energy atmosphere of a leading Southeast Asian e-commerce ecosystem. The aesthetic balances intense commercial urgency—such as limited-time flash deals, voucher claims, and live event triggers—with structured, high-density transactional clarity.

The visual style is **High-Density Retail Functionalism**:
- **Information Density:** Compact spacing, maximized viewport real estate, and rapid-scan data architectures allow shoppers to evaluate dozens of products, compare prices, and read social proof at a glance.
- **Urgency & Commerce Energy:** Strategic bursts of signature hot orange and crimson callouts signal immediate savings, discounts, and real-time inventory velocity (e.g., "Sold 1.2k", countdown clocks).
- **Utilitarian Base:** Pure white product tiles float on a muted cool gray canvas, ensuring multi-colored merchant imagery and badges pop without visual friction.

## Colors

The color architecture is built around conversion mechanics and visual hierarchy:

- **Primary (`#EE4D2D`):** The signature vibrant orange anchors all critical conversion touchpoints: primary action buttons ("Buy Now", "Add to Cart"), main tab indicators, promotional banner headers, and price accents.
- **Secondary (`#FF5722`):** A lighter, high-luminance orange used for subtle hover transitions, secondary banners, active filter pills, and gradient highlights.
- **Tertiary (`#FFBA00`):** An energetic golden amber utilized for rating stars, coin rewards, gamified shopping promotions, and VIP tiers.
- **Canvas & Surface Layering:** The global viewport defaults to `#F5F5F5` (page-canvas), while content containers, product cards, sidebars, and navigation rails utilize pristine `#FFFFFF` (surface-white) to optimize contrast and merchandise legibility.
- **Promotional Alerts & Badges:** `#D0011B` is reserved exclusively for "Shopee Mall" verification labels, negative inventory counters, and flash sale headers. `#FFE97A` provides the high-contrast backdrop for yellow discount ribbons (`-50%`).

## Typography

The typography pairs **Work Sans** for crisp, geometric numeric/headline authority with **Inter** for dense, neutral UI text and multi-line item labels.

- **Numerics & Price Hierarchy:** All monetary values and countdown digits use Work Sans. Active product prices must be rendered in 600 or 700 weights in primary orange, preceded by an inline currency symbol (`$` or `₫`/`₱`/`RM`) sized 2px smaller than the integer. Original strike-through prices sit adjacent in `price-original` styled with `#757575` and line-through formatting.
- **Product Title Density:** Product names in grid tiles are restricted to two lines of text via webkit-line-clamp (`title-card`), terminating in an ellipsis to guarantee strict vertical tile alignment.
- **Micro-Data:** Social proof signals (e.g., "1.4k sold", "Ships from SG") utilize `body-compact` or `label-micro` to keep vertical footprints minimal while retaining legibility.

## Layout & Spacing

The layout is optimized for 1200px fixed-width desktop screens, providing a structured, content-rich marketplace environment:

- **Desktop Framework:** A centralized 1200px container horizontally centered on the `#F5F5F5` viewport.
- **Product Grid Model:** A standard 6-column fluid grid within the 1200px container for "Daily Discover" and general catalog views (approx. 190px per card with 10px / `0.625rem` gutters). Flash Sale sections use either a 6-item or 5-item horizontal carousel.
- **Rhythm:** Internal card padding is strictly constrained to `0.5rem` (`space-sm`) on the sides and bottom to prioritize the 1:1 aspect ratio square product thumbnail. Section blocks maintain a vertical margin of `1.25rem` to `1.5rem` (`space-xl`).
- **Catalog Navigation Sidebar:** When category filters are present, the layout adopts a 200px fixed-width left filter column with a 1000px right-hand 5-column product grid, separated by a 16px horizontal gap.

## Elevation & Depth

Visual hierarchy uses ultra-subtle borders paired with lightweight, directional hover elevations rather than deep ambient shadows, preventing blur from muddying dense layouts:

- **Resting Layer (Flat Retail Canvas):** Standard product cards, category tiles, and banner blocks possess zero drop shadow. They are delineated by a 1px border of `#EBEBEB` or simple color separation against the `#F5F5F5` canvas.
- **Card Hover State (Hover Lift):** On cursor hover, the card transforms upward by `translateY(-1px)` and gains an active elevation: `0 1px 20px 0 rgba(0, 0, 0, 0.05)`, with the border transitioning to `#EE4D2D` or remaining crisp `#EBEBEB`.
- **Global Sticky Header & Cart Flyout:** The top fixed header has a 1px bottom border `#E5E5E5` and a tight elevation shadow `0 2px 8px rgba(0, 0, 0, 0.06)`. Dropdown menus (cart preview, notification flyouts, account menu) use `0 4px 16px rgba(0, 0, 0, 0.12)` encased in a 1px `#E0E0E0` border.
- **Voucher Cutout Effect:** Promotional ticket components use radial mask punch-outs on their left and right edges combined with a dashed divider line rather than shadows to express physicality.

## Shapes

The design uses a **Soft (Level 1)** corner radius language (2px to 4px) to retain an efficient, compact modular appearance without feeling clinical:

- **Product Cards:** Uniform 2px corner radius (`0.125rem`) with `overflow: hidden` to ensure the 1:1 image cleanly aligns with the container.
- **Action Buttons & Inputs:** 2px to 4px (`0.25rem`) corner radius. Rounded shapes are strictly functional, maintaining tight bounding boxes.
- **Badges & Vouchers:** Discount tags at top-right of cards use sharp asymmetrical cuts (folded ribbon style) or a 2px radius. Free shipping tags and mall status badges maintain a crisp 2px border radius.
- **Pills & Carousels:** Round navigation arrows on product carousels feature fully rounded circles (50% radius) floating centered on the container edges with a drop shadow for high contrast over merchant photos.

## Components

### Buttons
- **Primary ("Buy Now", "Add to Cart"):** Background `#EE4D2D`, text `#FFFFFF`, 40px height for main actions, 32px height for card-level actions. Hover state drops to `#D73211`.
- **Secondary Outlined:** Background `transparent`, 1px solid border `#EE4D2D`, text `#EE4D2D`. On hover, fills with `#FFF5F1`.
- **Ghost/Tertiary:** No border, transparent background, text `#555555`.

### Product Cards
- **Structure:** Square 1:1 product image at the top; 8px padding wrapper below containing:
  1. Product Title (2 lines max, 12px or 14px Inter, `#222222`).
  2. Promotion Tags (e.g., "Cashback", "Free Shipping" in 10px `#EE4D2D` outline badges).
  3. Price row (`#EE4D2D`, bold 16px Work Sans) with original price strikethrough.
  4. Bottom metadata row showing star ratings and right-aligned "XX Sold" counter in 10px muted text.
- **Ribbons:** Top-right corner discount badge with `#FFE97A` background, orange discount text (e.g., `-45%`), and a stylized bottom chevron notch.

### Flash Sale Block
- **Header:** Bright yellow/orange background banner or pure white bar with a bold orange "FLASH SALE" text logo and real-time countdown timer.
- **Countdown Module:** Three black square boxes (`#000000`, 2px radius) holding hours, minutes, and seconds in bold white Work Sans digits, separated by orange or black colons.
- **Progress Trackers:** Inside card tiles, a 12px tall rounded track `#FFBDB8` with an inner filled bar `#EE4D2D` displaying absolute progress text (e.g., "32 SOLD", "SELLING FAST") overlaid in 9px bold white text.

### Badges & Chips
- **Mall Label:** Pure crimson `#D0011B` background with 2px radius, displaying "Mall" in 10px bold white text, anchored to the top-left of the image or inline before the product title.
- **Category Icons:** 48x48px circular or soft-cornered icon containers placed above 12px center-aligned category labels inside a multi-row square-grid matrix.

### Inputs & Filters
- **Global Search Bar:** Large 40px height input with a 2px `#EE4D2D` border, flanked by a 36px solid `#EE4D2D` search button featuring a white magnifying glass icon.
- **Filter Checkboxes:** 14px square boxes with a 1px `#CCCCCC` resting border, shifting to solid `#EE4D2D` with an internal white checkmark when selected.