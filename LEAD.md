# Lead: Codename CORAL

| | |
|---|---|
| **Business** | Codename CORAL — Mira Road's first tropical-themed luxury residences by **Mayfair Housing** |
| **Old site** | _None_ — greenfield 3D marketing site (no predecessor to migrate) |
| **New site (local)** | `site/` — Next.js 14 app · `npm run dev` (or `npm run build && npm start`) |
| **New site (deployed)** | **https://codename-coral.vercel.app** (Vercel project `codename-coral`) |
| **Git** | GitHub `suresh-3x/suresh-3x`, branch `claude/codenamecoral-revamp-JoPbn` — repo root is this folder; app lives in `site/` |
| **Archived on** | 2026-06-07 |
| **Stack** | Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS (coral/ocean/sand theme) · three.js + @react-three/fiber + drei + postprocessing (Bloom) · Framer Motion (reveals) · Lenis (smooth scroll) · Zod (form validation) · Fraunces + Inter via `next/font` |

> **This is the reference site** for the three.js design bar applied across the other folders. See the root `CLAUDE.md`.

## Contact / business facts
- **Developer:** Mayfair Housing
- **Tagline:** "Live in the reef of calm."
- **Location:** Mira Road (tropical-themed luxury residences)
- **Phone / email / RERA:** placeholders in `site/lib/content.ts` (`+91 00000 00000`, `sales@codenamecoral.com`, `{{RERA_NO}}`) — **confirm with Mayfair Housing before go-live.**
- Commercial/legal figures (price, carpet area, RERA, possession) are intentionally placeholders.

## What the site is
Single-page scroll experience: procedural WebGL coral-reef hero, cinematic scroll reveals, interactive amenities filter + tower explorer, validated lead-capture form, full SEO / accessibility / reduced-motion fallback coverage.

- **Routes:** `/`, `/privacy`, `/disclaimer`, `/api/enquire` (Zod-validated) — 9 build outputs incl. sitemap/robots.
- **3D:** `components/three/` — `CoralCanvas` (R3F canvas: coral mesh + drifting particle field + Bloom + pointer-parallax camera rig, with offscreen/tab-hidden pause, dpr clamp, reduced-motion fallback), `Coral`, `Particles`.

## Fixes applied (this engagement)
- **Smooth-scroll bug** — global CSS `html { scroll-behavior: smooth }` fought Lenis's per-frame `scrollTop` writes, making the page scroll painfully slowly (frozen ~2s under wheel input, then lurching). Fixed by scoping smooth behavior to `html:not(.lenis)` and importing the official `lenis/dist/lenis.css` guard. Verified live: 20 wheel ticks now reach the target position immediately instead of stalling. (`site/app/globals.css`, `site/components/SmoothScroll.tsx`)
- **3D performance / "glitchy"** (2026-06-08) — the hero canvas ran a per-frame
  directional **shadow map** on the rotating coral (jank + shadow-acne flicker) at
  `dpr 2` with 600 particles. Fixed: shadows **off**, `dpr` capped at **1.5**, particles
  600→320, Bloom softened (intensity 0.7→0.55, threshold 0.35→0.5). Reef still reads well
  on lighting + bloom alone. Redeployed prod, verified.
- **Interim imagery** (2026-06-08) — the site shipped with empty `public/`; Gallery,
  Residences and Location rendered gradient placeholder tiles. Added 10 genuinely
  royalty-free stock photos (**Unsplash License**, commercial use, no attribution
  required) as **interim placeholders — to be swapped for real Mayfair Housing renders
  before go-live.** Downloaded local copies into `site/public/gallery/` (no hotlinking);
  wired in via `next/image` (`fill`, `object-cover`, sized) sitting **under** the existing
  dark gradient/grain/hover overlays so titles stay legible, with `tone` gradients kept as
  the fallback color. Gallery lightbox now shows the full image; Residences cards got fitting
  interior photos; the Location "stylized map placeholder" gradient was replaced with an
  aerial coastline under the dark map overlay/grid/marker. Build green (9 routes), redeployed
  prod, verified a deployed image returns `200 image/jpeg`.
  (`site/lib/content.ts`, `site/components/sections/Gallery.tsx`, `Residences.tsx`, `Location.tsx`, `site/public/gallery/*`)
  - **Source photo pages (Unsplash License):**
    - Tropical Arrival Court → https://unsplash.com/photos/a-pathway-leading-to-a-tropical-resort-with-palm-trees-zv-_9KrUvdo (`arrival-court.jpg`)
    - Infinity Pool Deck → https://unsplash.com/photos/luxury-infinity-pool-at-sunset-with-lounge-chairs-KgybDitNR18 (`infinity-pool.jpg`)
    - Deck Residence Living → https://unsplash.com/photos/modern-living-room-with-sectional-sofa-and-large-window-yxO8YG082v8 (`deck-residence-living.jpg`)
    - Landscaped Podium → https://unsplash.com/photos/lush-green-pathway-through-a-tropical-garden-NgJMXoPoDmg (`landscaped-podium.jpg`)
    - Clubhouse Lounge → https://unsplash.com/photos/grand-hotel-lobby-with-ornate-columns-and-colorful-sculpture-YzWmXSlTjWg (`clubhouse-lounge.jpg`)
    - Skyline at Golden Hour → https://unsplash.com/photos/city-skyline-near-body-of-water-during-golden-hour-4Y_f_LvAu3U (`skyline-golden-hour.jpg`)
    - Residences 3 BHK interior → https://unsplash.com/photos/modern-apartment-interior-with-kitchen-and-living-space-xrnNNnq6djg (`apartment-interior.jpg`)
    - Location aerial coastline → https://unsplash.com/photos/an-aerial-view-of-a-beach-and-the-ocean-6ZdM7iQab3c (`aerial-coastline.jpg`)
    - Oceanfront architecture (spare) → https://unsplash.com/photos/infinity-pool-overlooking-the-ocean-on-a-sunny-day-ZWmyi_lbptQ (`oceanfront-architecture.jpg`)
    - Resort pathway (spare) → https://unsplash.com/photos/palm-trees-line-a-path-leading-to-a-beach-resort-OymwZutx6FI (`resort-pathway.jpg`)
- **Structure** — restructured into the standard folder shape (`LEAD.md` + `artifacts/` + `site/`) to match the other revamps. App moved from repo root into `site/`; `.git` stays at the folder root.

## Artifacts (`artifacts/`)
| Path | What |
|---|---|
| `WEBSITE.md` | Original build README (stack, structure, scripts, features) |
| `REVAMP_PROMPT.md` | The brief the site was generated from |

## Deploy
From `site/`: `vercel --prod` (Vercel project `codename-coral`, deployment protection disabled so all generated URLs are public). Repo root is this folder; the app is in `site/`, so the Vercel project's **root directory is `site`** (CLI deploys run from `site/`).
