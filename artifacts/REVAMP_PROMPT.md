# Revamp Prompt — Codename CORAL (Mayfair Housing) → Modern, Sleek 3D Website

> Copy everything below the line into a fresh Claude Code session (or any capable coding agent) to build the site. It is self-contained: project facts, design direction, tech stack, 3D approach, page-by-page spec, skills to invoke, and a production-readiness checklist.

---

## ROLE

You are a senior creative front-end engineer + 3D web specialist. Build a **production-ready, modern, sleek 3D marketing website** for a luxury real-estate launch. Treat this as a flagship portfolio-grade build: cinematic, fast, accessible, and conversion-focused.

## THE PROJECT (ground truth — do not invent facts beyond this)

- **Brand / Developer:** Mayfair Housing
- **Project name:** Codename CORAL (a.k.a. Mayfair Coral)
- **Positioning:** Mira Road's first tropical-themed luxury residences — "a tropical sanctuary shaped within Mumbai." Inspired by the slow, layered formation of coral: light, greenery, water, and breathable architecture.
- **Location:** MTNL Road, near Jangid Circle, Mira Road East, Mumbai.
- **Scale:** ~1.75 acres. A 35-storey tower (2 basements + 4 podium levels + an E-deck + 30 habitable floors).
- **Residences:** 2 & 3 Bed **Deck Residences**.
- **Amenities:** 40+ curated amenities; resort-inspired landscapes and open spaces.
- **Connectivity:** Metro Line 9 (Sai Baba Nagar & Kashigaon), Western Express Highway, Mira Road railway station; linked to the Delhi–Mumbai Industrial Corridor, Mumbai–Ahmedabad Bullet Train, and Vadodara–Mumbai Expressway.
- **Status:** Newly launched (April 2026), strategic expansion into the Mira Road micro-market.
- **Tagline ideas (pick/refine):** "Live in the reef of calm." / "Coral-inspired living, Mumbai-rooted." / "Where the tropics meet the skyline."

> Use only the facts above for hard claims (floors, location, configs). Where exact figures (price, carpet area, RERA no., possession date) are unknown, use clearly-labeled placeholders like `{{RERA_NO}}` and a `// TODO: confirm` comment — never fabricate legal/commercial numbers.

## DESIGN DIRECTION

- **Mood:** Calm, organic luxury. Tropical-modern. "Coral reef meets glass tower." Editorial whitespace, slow cinematic motion, premium but warm — not cold corporate.
- **Color system:** Coral/blush (`#FF6F61` family) as the signature accent, layered over deep ocean teals/greens and warm sand/ivory neutrals. Dark "underwater" sections + light "above-water" sections to create depth rhythm. Define as CSS custom properties / a Tailwind theme; support a tasteful dark mode.
- **Typography:** A refined serif display (e.g., Fraunces / Canela-like) for headlines + a clean grotesque sans (e.g., Inter / Geist / Satoshi) for body. Big type, generous tracking, fluid `clamp()` sizing.
- **Texture:** Subtle grain, soft gradients, caustic light/water ripple accents, frosted glass (backdrop-blur) cards.
- **Motion language:** Scroll-driven storytelling — the page should feel like descending through water then rising to a skyline. Easing should be slow and luxurious (custom cubic-bezier), never bouncy/gimmicky.

## THE 3D — THE CENTERPIECE (make it tasteful, not a tech demo)

- **Hero:** A live WebGL hero. Either (a) a stylized coral/reef formation that slowly blooms, with caustic light and floating particles, or (b) the tower massing rising from a podium garden. Slow auto-orbit + subtle parallax to pointer/scroll. Must look intentional and elegant.
- **Scroll-tied 3D:** As the user scrolls, transition the scene (reef → podium garden → tower → skyline at golden hour). Camera moves on a path driven by scroll progress.
- **Interactive moments:** A 3D building/floor explorer or an amenity "reef map" where hovering hotspots reveals labels. Optional 360°/orbit viewer for a sample residence.
- **Quality bar:** PBR materials, soft shadows, bloom/depth-of-field post-processing used sparingly, environment lighting (HDRI). Aim for cinematic, not noisy.

### 3D engineering rules (non-negotiable for "production-ready")

- Use **React Three Fiber** + **drei** + **postprocessing**; physics only if needed.
- **Lazy-load** all 3D below the fold; never block first paint on WebGL. Suspense + a branded loader.
- Ship **GLB/GLTF with Draco/Meshopt compression**; KTX2/Basis textures. Budget the hero scene aggressively (target < a few MB, document the budget).
- **Capability gating:** detect WebGL2 + device tier; serve a high-quality static/poster fallback (image or video) on low-end devices and when `prefers-reduced-motion: reduce` is set. The site must be fully usable with zero 3D.
- Cap DPR (e.g., `dpr={[1, 2]}`), pause `requestAnimationFrame`/`frameloop="demand"` when the canvas is offscreen or tab hidden, and dispose geometries/materials/textures on unmount. No memory leaks.
- Maintain 60fps on a modern laptop and a smooth degraded experience on mid mobile. Profile it.

## TECH STACK (default — adapt only with good reason, and say why)

- **Framework:** Next.js (App Router) + TypeScript (strict).
- **Styling:** Tailwind CSS with a custom theme; CSS variables for the color/spacing system.
- **3D:** three.js via @react-three/fiber, @react-three/drei, @react-three/postprocessing.
- **Animation:** GSAP + ScrollTrigger (or Framer Motion) for scroll-driven sequences and reveals; Lenis for smooth scroll.
- **Content:** Local typed content modules (or MDX) so copy/specs live in one editable place — no hardcoded strings scattered across components.
- **Forms:** An "Enquire / Book a site visit" lead form (name, phone, email, configuration interest, consent). Wire to an API route with validation (zod) + spam protection (honeypot/rate-limit); stub the email/CRM send behind an env-config'd integration with `// TODO`.
- **Quality tooling:** ESLint + Prettier, `tsc --noEmit`, and at least a smoke test of the build.

## SITE STRUCTURE / PAGES

Single-page scroll experience with anchored sections (plus a couple of routes). Sections:

1. **Nav** — minimal, transparent-over-hero, frosted on scroll; logo, anchor links (Overview · Residences · Amenities · Location · Gallery · Enquire), prominent "Book a Site Visit" CTA, mobile drawer.
2. **Hero (3D)** — brand, tagline, primary CTA, subtle scroll cue.
3. **The Story / Concept** — the coral-inspired narrative (light, water, greenery, breathable architecture). Scroll-revealed editorial layout.
4. **Residences** — 2 & 3 Bed Deck Residences; cards with configuration highlights and the "Deck" differentiator; placeholders for carpet area/price.
5. **Amenities (interactive)** — "40+ curated amenities" presented as an interactive reef/map or filterable grid with icons and hover states.
6. **Tower / Floor explorer (3D)** — interactive massing: 35 storeys, podium levels, E-deck; clickable to reveal info.
7. **Location & Connectivity** — map (embed or stylized), with metro/highway/rail connectivity and the 5–15 min social ecosystem (schools, hospitals, shopping).
8. **Gallery** — renders/lifestyle imagery with a sleek lightbox; use tasteful placeholders.
9. **Enquire / Contact** — lead form + developer info + RERA/legal placeholder strip.
10. **Footer** — Mayfair Housing branding, nav, socials, disclaimer, RERA placeholder.

Add routes for `/privacy`, `/disclaimer`, and a custom `404`.

## CONTENT & COPY

Write polished, on-brand marketing microcopy (concise, premium, evocative — coral/water/light metaphors used with restraint). Provide real section copy, not lorem ipsum. Keep all factual claims consistent with "THE PROJECT" above.

## PRODUCTION-READINESS CHECKLIST (must all be satisfied)

- **Performance:** Lighthouse mobile Performance ≥ 90 (or document the realistic ceiling given the 3D hero and the mitigations used). Optimized images (`next/image`, AVIF/WebP), font `display: swap`, code-splitting, route prefetch.
- **Accessibility:** WCAG 2.1 AA — semantic landmarks, keyboard-navigable nav/form/lightbox, visible focus states, alt text, ARIA where needed, sufficient contrast on coral accents, `prefers-reduced-motion` fully honored (disable scroll-jacking/auto-motion).
- **SEO:** Per-page metadata, Open Graph + Twitter cards, JSON-LD (`Residence`/`RealEstateListing` + `Organization`), sitemap.xml, robots.txt, canonical URLs.
- **Responsive:** Flawless from 320px → ultrawide. Mobile gets simplified/poster 3D where appropriate.
- **Cross-browser:** Latest Chrome, Safari, Firefox, Edge; iOS Safari WebGL quirks handled.
- **Robustness:** Graceful WebGL-unavailable fallback; form validation + error/success states; no console errors.
- **Analytics & consent:** Pluggable analytics hook + a cookie/consent stub (env-gated).
- **Docs:** A real `README.md` — stack, how to run/build, where to edit content, the 3D asset pipeline, perf budget, and every `TODO`/placeholder that needs real data before go-live.

## DELIVERY WORKFLOW (how I want you to work)

1. **Plan first.** Restate scope, propose the structure and the exact dependency list, flag any assumptions and the placeholders you'll need from me, then proceed.
2. **Scaffold** the Next.js + TS + Tailwind app and get a styled, non-3D shell of all sections deploying/building before adding WebGL.
3. **Layer in 3D** progressively behind lazy boundaries and capability gates, with the fallback path working at every step.
4. **Polish** motion, copy, responsiveness, and a11y.
5. **Verify** before claiming done: run the build, run lint + `tsc`, and actually launch the app to confirm the hero, scroll sequence, fallback path, and the form all work — report what you observed, with the real command output. If something fails, say so.
6. **Commit in logical chunks** with clear messages; **do not** create a PR unless I ask.

### Skills to use during the build (invoke these — don't just describe them)

- `run` — launch the dev server / build and confirm the site actually renders (hero, scroll scene, mobile fallback).
- `verify` — manually validate that the 3D hero, scroll-driven sequence, reduced-motion fallback, and lead form behave correctly before declaring the task done.
- `code-review` (effort: high) — review the diff for correctness bugs and cleanup before final commit; address findings.
- `simplify` — tighten the code (reuse, dead code, oversized components) once it works.
- `security-review` — check the lead-form API route, input validation, and any third-party/env handling before go-live.
- `init` — generate/refresh `CLAUDE.md` so future sessions understand the codebase and 3D pipeline.

## CONSTRAINTS

- No fabricated prices, RERA numbers, carpet areas, or possession dates — use labeled placeholders.
- 3D must enhance, never obstruct: content and CTAs must be reachable and fast even if WebGL fails.
- Keep dependencies lean and current; pin versions; no abandoned packages.
- Ask me before any irreversible/outward-facing action (deploying, wiring a real CRM/email, sending data anywhere).

**Begin with the plan.**
