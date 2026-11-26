# User Prompts Log

This file collates all user prompts submitted in this session in chronological order.

---

## Prompt 1 — Repository Import & Migration

> This app was imported from GitHub repository `yueyanggg/Shopee_Original-`.

- **Timestamp:** `2026-11-25T20:15:52-08:00`
- **Action Taken:** Migrated the imported Vite + React + TypeScript application from Bun to npm, added `.env.example`, configured `vite.config.ts` for port `3000` (`0.0.0.0`, `allowedHosts: true as const`), and verified build and lint checks.

---

## Prompt 2 — UI/UX Enhancement Implementation

> implement the changes based on the attached

- **Timestamp:** `2026-11-25T20:19:38-08:00`
- **Attachment:** `/public/assets/aistudio/Shopee_UIUX_Enhancement_24ec96a0.jpg`
- **Key Points from Attached UI/UX Board:**
  - **Pitfalls Identified:**
    - Overwhelming number of promotional banners
    - Poor visual hierarchy; prices are not sufficiently prominent
    - Specific searches leave compatibility work to the shopper (e.g., searching `"iPhone 17 case"` surfaces bundled listings for 17, 17 Pro Max, and other generations)
  - **User Enhancements:**
    1. Prioritise key shopping actions
    2. Introduce persistent category navigation
    3. Personalise homepage based on shopping intent
    4. Make search the clearest starting point
    5. Put offer conditions next to the price
    6. Make deal cards easier to compare
  - **Proposed User Flow:**
    1. Land on intent-led homepage
    2. Search or browse by persistent category navigation
    3. Refine results with specific compatibility/model filters
    4. Shortlist and compare alternatives
    5. Select product with transparent offer conditions & verified variant
    6. Add to cart with auto-applied best eligible vouchers & transparent final price
    7. Confirm delivery and payment details
    8. Place order
    9. Track orders through live status
  - **Intended Outcomes:** Reduced cognitive load and improved product discoverability.

---

## Prompt 3 — Collate Prompts

> collate all the prompts above and store them in a file named prompts.md

- **Timestamp:** `2026-11-25T23:26:06-08:00`
- **Action Taken:** Collated all prompts into `prompts.md`.
