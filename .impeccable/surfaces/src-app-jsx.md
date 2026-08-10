---
version: 1
slug: "src-app-jsx"
primary_target: "src/App.jsx"
related_targets: ["src/styles.css","index.html"]
---

# Surface brief: Business & Travel Bulgaria 2026

## Scope and mode

- Scope: the public landing page at `/` and its responsive states.
- Mode: Persuade.
- Audience: Russian-speaking entrepreneurs, experts, investors, and expatriates in Europe.
- Job: make the combined business forum and Black Sea travel format clear, credible, and desirable.
- Primary action: `Получить программу`; it leads to the contact section and organiser Natalia Maslova's Telegram `@maslovanataly`. The same section conditionally renders the configured Tally application form and remains visually unchanged when no form ID is present.
- Proof: real speakers and countries, the timed 12 September programme, real destination photography, transparent accommodation prices.
- Constraints: React/Vite, static GitHub Pages, Russian, no backend, WCAG AA, honest claims only, fast mobile path.

## Chosen direction

`Черноморский модернистский атлас`, approved composition B: `.impeccable/mocks/atlas-b-horizon.webp`.

The page is an editorial coastal field guide, not a stack of marketing cards. Deep blue-black, mineral white, cobalt, and sea-glass create a cold Black Sea palette. Condensed Cyrillic display type, documentary crops, halftone/cyanotype treatments, sharp architectural fields, and precise factual typography form one visual world.

## First viewport contract

Header and hero together occupy a full `100dvh`. No speakers or next-section content may be visible before the first scroll at common desktop and mobile heights. The headline is fitted by content into three sharp typographic bands: sea-glass/ink, cobalt/white, and ink/mineral-white. The panoramic source photo passes behind those bands and creates one uninterrupted sea horizon. The hero contains exactly one dominant action and the essential date/place facts. No countdown.

## Memorable moment

The headline becomes coastal wayfinding: three content-fitted modernist bands sit across the image horizon, then the panorama resolves behind them as the page enters. The effect must remain legible, restrained, and disabled under reduced motion.

## Story

Promise and place → why the format matters → real people → exact forum day → coastal programme → price by occupancy → participant voices → direct organiser contact.

## Fidelity inventory

| Approved element | Production primitive |
|---|---|
| Compact navigation | Semantic header/nav + CSS |
| Oversized hero typography | Semantic headings + CSS |
| Black Sea panorama | Original reference raster in `public/images` |
| Cyanotype/halftone material | CSS filter/overlay |
| Cobalt edge action | Semantic anchor + CSS |
| Speaker contact sheet | Original portraits + semantic HTML/CSS + real data |
| Sticky programme | Ordered list + CSS sticky composition |
| Excursion mosaic | Original source photography + CSS grid |
| Occupancy pricing | React state + semantic buttons |
| Testimonial selector | React state + semantic buttons |
| Reveals and horizon wipe | CSS/IntersectionObserver; content visible by default; reduced-motion path |

## Open items

- Source images are temporarily approved for reconstruction; rights must be confirmed or the files replaced before a public campaign.
- A distinct classic coastal page will be built afterward at `classic.html`, without diluting this atlas direction.
