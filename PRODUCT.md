# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React with Vite. Single-page static deployment to GitHub Pages at `/`. The build uses repository-safe relative asset paths and requires no server runtime.

## Users

Russian-speaking entrepreneurs, experts, investors, and expatriates living across Europe who want practical business knowledge, an international professional circle, and an optional combined business-and-travel experience in Bulgaria.

## Product Purpose

Present and sell participation in Business & Travel Bulgaria 2026. The primary event is the First International Experts Forum on 12 September 2026 in Bulgaria: eight experts, eight countries, and participants from more than twelve countries. The page should explain the people, topics, main-day programme, networking value, and participation formats, then lead visitors to organiser Natalia Maslova in Telegram.

## Positioning

The forum connects entrepreneurs, experts, and people building businesses in Europe. Its practical themes include scaling, the psychology of money, personal brand and AI, partnership models, community-led sales, international teams, and new income sources. Its central value is the international environment: useful introductions, potential clients and partners, and ideas for joint projects.

For experts and entrepreneurs based in Bulgaria, the event also creates an opportunity to present themselves, their expertise, business, or project to an international audience. This presentation format is a separate paid option; individual conditions are provided by the organiser and must not be invented on the site.

## Operating Context

Most visitors arrive from social media on mobile. They need to understand quickly that the forum itself costs 25 €, see what happens on 12 September, recognise relevant speakers, distinguish the one-day forum from the full trip, and contact the organiser through Telegram. A countdown supports urgency but must resolve gracefully after the event.

## Participation Formats

- **Forum only:** 12 September 2026, forum admission plus coffee break — **25 €**.
- **Full package with hotel:** 8–13 September 2026 — **500 €** for one participant, **700 €** for two, or **800 €** for three. Flights and transfer are excluded.
- The evening continuation includes dinner, live music, and an evening programme at Khan's Tent; the site must not imply that this is included in the 25 € forum ticket unless separately confirmed.

## Page Architecture

The single route `/` follows this order:

1. hero;
2. countdown timer;
3. key facts;
4. why the event matters;
5. main day and programme for 12 September;
6. speakers;
7. excursions and coast;
8. pricing and participation formats;
9. testimonials;
10. FAQ;
11. organiser contact and native application form.

## Capabilities and Constraints

- One-page Russian-language marketing site.
- One public route: `/`.
- Static hosting on GitHub Pages.
- Preserve confirmed dates, location, speakers, programme facts, pricing, and organiser contact.
- Primary conversion: the native application form, with direct contact to Natalia Maslova in Telegram, `@maslovanataly`, `https://t.me/maslovanataly`, as a resilient fallback.
- The final contact section always renders the native form. With a valid `VITE_LEAD_ENDPOINT`, it sends a JSON `POST` to a Cloudflare Worker that validates and maps the request into Airtable.
- When `VITE_LEAD_ENDPOINT` is absent or invalid, submitting the form opens a prefilled Telegram application; network errors and the 15-second client timeout also expose the Telegram fallback without clearing the entered values.
- Referral links use `?ref=<expert-slug>`. The browser keeps validated first- and last-referral attribution for 30 days; the latest valid referral receives visible and CRM credit while the first remains available for history. Lead personal data is never stored locally.
- GitHub Pages remains a static frontend with no server runtime. Airtable credentials and write access exist only in the external Cloudflare Worker and must never be exposed through `VITE_*` variables.
- The page must be responsive, keyboard accessible, motion-safe, and usable when the external lead endpoint is unavailable.
- The countdown must stop or switch to a truthful post-event state instead of displaying misleading values.
- Do not fabricate the venue, availability, hotel identity, payment mechanics, refund terms, or the price of the separate business-presentation format.

## Brand Commitments

- Product name: Business & Travel Bulgaria 2026.
- Visual direction: «Черноморский модернистский атлас».
- Typography: `Sofia Sans Condensed Variable` for display text and `Manrope Variable` for body and interface text.
- Language: Russian, with participant quotes retained in their original language where factual.
- The experience should feel editorial and premium, with strong typography and composition rather than generic marketing cards.
- The Black Sea setting, international character, practical value, and human connection are central brand signals.

## Evidence on Hand

- Public reference page: `https://bulgaria-business-sea.lovable.app/`.
- User-supplied event description confirms 12 September 2026, Bulgaria, eight experts, eight countries, participants from more than twelve countries, a 25 € forum ticket with coffee break, the principal programme themes, and the separate paid presentation opportunity.
- Full-package pricing: 500 € for one person, 700 € for two, and 800 € for three for 8–13 September with hotel. Flights and transfer are excluded.
- The native form, visible credited partner, Telegram fallback, Worker implementation, Airtable field mapping, and GitHub Pages endpoint mapping are implemented. Worker deployment, least-privilege secrets, Turnstile keys, privacy copy, and a final end-to-end production submission remain operational launch checks.

## Product Principles

1. Make the 25 € forum offer and 12 September date visible early without rewriting the event into a price-only promotion.
2. Place the main day and programme before the speaker roster so the event structure is understood first.
3. Distinguish clearly between the one-day forum and the full package with hotel.
4. Put real people, practical topics, and international networking ahead of generic lifestyle promises.
5. Keep the mobile path from interest to the application form or Telegram fallback short and obvious.
6. Preserve factual content while reducing repetition and reading fatigue.

## Accessibility & Inclusion

Meet WCAG AA contrast, provide visible keyboard focus, semantic landmarks, meaningful image descriptions, reduced-motion support, and touch targets suitable for mobile visitors.

## Launch Gate

All source images must have confirmed publication rights or be replaced with appropriately licensed alternatives before the public campaign starts. Replacement files should retain the existing filenames and similar crop intent so the page composition remains stable.
