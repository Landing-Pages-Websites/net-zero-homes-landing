# Net Zero Construction — Landing Page

Production Meta-traffic landing page for **Net Zero Construction**, a luxury custom
home builder on Florida's Gulf Coast. Ships to `https://info.netzerohomes.build`.

## Stack
- Next.js (App Router) + Tailwind CSS v4
- Manrope (`next/font`) — single-family display + body
- Client-owned project photography in `public/images/` (16 images, each used once)

## Structure
Single page, anchor navigation only. Twelve section anchors in DOM order:
`#hero · #trust-bar · #why-icf · #proven-in-storms · #energy-smart-safe-home ·
#process · #projects · #owner-led · #proof · #service-area · #faq · #consultation`

The consultation form appears in exactly two places (`#hero` and `#consultation`);
every other CTA scrolls to `#consultation`. The mobile sticky bar is form-only.

## Tracking
`MEGA_TAG_CONFIG` (in `src/app/layout.tsx`) carries `siteKey`, `siteId`,
`gtmId` (`GTM-PCKBHNHB`) and `pixelId` (`4326648287565669`). The MEGA optimizer
injects **both** GTM and the Meta Pixel from that config — no hand-written GTM
loader, `<noscript>` iframe, or `fbq('init')` block. The shared CTM script
(`572388.tctm.co/t.js`) swaps the displayed number to a tracked line forwarding
to 941-685-8478. `form_submit` fires on every submission; `qualified_lead` fires
only when the estimated budget is `$1 million–$3 million` or `$3 million or more`.

## Develop
```bash
npm run dev     # http://localhost:3000
npm run build   # production build
```

Deploy via git push to the Git-linked Vercel project — never the CLI fallback.
