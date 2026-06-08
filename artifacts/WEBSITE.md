# Codename CORAL — 3D Marketing Website

A modern, sleek, production-ready 3D marketing site for **Codename CORAL**, Mira
Road's first tropical-themed luxury residences by **Mayfair Housing**.

Built as a single-page scroll experience: a procedural WebGL coral reef hero,
cinematic scroll reveals, an interactive amenities filter and tower explorer, a
validated lead-capture form, and full SEO / accessibility / fallback coverage.

## Tech stack

| Concern    | Choice                                                        |
| ---------- | ------------------------------------------------------------- |
| Framework  | Next.js 14 (App Router) + TypeScript (strict)                 |
| Styling    | Tailwind CSS (custom coral / ocean / sand theme)              |
| 3D         | three.js · @react-three/fiber · drei · postprocessing (Bloom) |
| Motion     | Framer Motion (reveals) · Lenis (smooth scroll)               |
| Forms      | Client form → `/api/enquire` route, validated with Zod        |
| Fonts      | Fraunces (display) + Inter (sans) via `next/font`             |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Project structure

```
app/
  layout.tsx          # fonts, metadata, JSON-LD, skip link, smooth scroll
  page.tsx            # assembles all sections
  api/enquire/route.ts# lead form endpoint (Zod + honeypot + rate limit)
  privacy / disclaimer / not-found / sitemap / robots
components/
  Nav.tsx · Footer.tsx · SmoothScroll.tsx
  sections/           # Hero, Story, Residences, Amenities, Tower, Location, Gallery, Enquire
  three/              # CoralCanvas, Coral, Particles (procedural WebGL hero)
  ui/Reveal.tsx       # scroll-into-view animation
lib/
  content.ts          # ALL copy & project specs (edit here)
  use-capabilities.ts # WebGL / reduced-motion / device-tier detection
```

## Editing content

All copy and project data live in [`lib/content.ts`](lib/content.ts) — names,
taglines, residences, amenities, tower stats, connectivity, gallery and contact
details. Components read from there; avoid hardcoding strings.

## The 3D hero

The hero scene (`components/three/`) is **fully procedural** — coral branches,
polyps and a drifting particle field are generated in code, so there are **no
external GLB/HDRI assets to download**. It is:

- **Code-split** and never server-rendered (`next/dynamic`, `ssr: false`).
- **Capability-gated** via `lib/use-capabilities.ts`: a CSS poster shows when
  WebGL is unavailable, the user prefers reduced motion, or on low-power devices
  (which also get a lighter scene — fewer particles, no bloom/shadows, capped DPR).
- **Paused** when the tab is hidden or the canvas scrolls offscreen.

To swap in custom GLB models later: add Draco/Meshopt-compressed `.glb` files to
`public/`, load them with drei's `useGLTF`, and keep them behind the same
Suspense + capability gates.

## Accessibility & performance

- Semantic landmarks, skip link, keyboard-navigable nav/form/lightbox, visible
  focus rings, ARIA on interactive controls.
- `prefers-reduced-motion` disables Lenis, the 3D scene, and CSS animations.
- Fonts use `display: swap`; security headers set in `next.config.mjs`.
- SEO: per-page metadata, OG/Twitter cards, JSON-LD (`Residence`), `sitemap.xml`,
  `robots.txt`, canonical URL.

## Before go-live — confirm placeholders

Search the codebase for `TODO` and `{{...}}`. Outstanding items:

- **MahaRERA number**, **carpet areas**, **pricing**, **possession date**
- Official **phone / email / social** links (`lib/content.ts → site`)
- **Lead delivery**: wire `app/api/enquire/route.ts` to a CRM or email
  (Resend / SendGrid) behind env vars — currently it validates and logs.
- Replace gallery gradient placeholders and the stylized map with **final
  renders** and an **embedded interactive map**.
- Set the canonical `site.url` if the domain differs.

## Deploy (Vercel)

This is a standard Next.js app — zero extra Vercel config needed.

1. Push this branch to GitHub.
2. In Vercel: **Add New → Project → Import** this repository (set the branch).
3. Framework preset auto-detects **Next.js**. Deploy.

Or via CLI from the repo root: `npx vercel --prod` (requires `vercel login` or a
`VERCEL_TOKEN`).

> Note: this lives in a GitHub **profile** repository (`suresh-3x/suresh-3x`).
> The profile `README.md` is intentionally left untouched; these docs are in
> `WEBSITE.md`.
