# Personal portfolio — plan

**Goal:** job hunting + personal brand, covering three identities: software developer, project manager, photographer.

## Update: more sections added to both paths

Weekday (programmer) page now goes: teaser tags → **Tech stack** (languages/frameworks, data/infra, PM & tools grid) → Selected projects → Experience (timeline) → **About** (portrait + bio, mirrors the photographer page's "Behind the photos") → **Testimonials** (quote cards) → **Certifications** → Contact. Tech stack cards now show real logos (Laravel, React, Node.js, TypeScript, JavaScript, MySQL, PostgreSQL, Redis, AWS, Jira, Notion, Figma) pulled live from the Simple Icons CDN (`cdn.simpleicons.org`) — free to use, no download needed. For the real Laravel/Inertia/React build, swap these `<img>` tags for the `react-icons` npm package (`react-icons/si`) instead, so the icons ship as part of the bundle rather than depending on an external CDN at runtime.

## Update: where "About Me" lives

Neither path had a real personal-story section — the welcome screen is just a one-line hook, and only the photographer page had "Behind the photos." Added a matching **About** section to the programmer page (portrait placeholder + bio, styled for the dark navy theme), placed after Experience and before Testimonials — so both paths now have their own personal-story beat in the same rhythm, right before the closing trust/contact sections.

Weekend (photographer) page now goes: teaser tags → **Gear** (camera/lenses/editing grid) → Gallery, now with **category filter buttons** (All/Portrait/Street/Landscape/Event — filters the photo grid live via `data-category` attributes) → Behind the photos (About) → **Bookings** (availability blurb + "Enquire about a shoot" CTA) → Contact.

All new content uses placeholder text — real quotes, cert names, gear specs, and photo categories to be filled in later.

See `portfolio-preview-v4.html`.

## Update: cursor themed per path

The custom cursor (dot + ring) used to always turn blue on hover, even while browsing the cream/gold photographer page. Fixed: the ring now switches accent per path — blue on programmer, and on photographer it swaps the circular ring for four small gold corner brackets (camera-viewfinder style) instead of just recoloring. Switches automatically when hovering a fork half, entering a page, or navigating back to welcome/fork.

**Bug fix:** the themed colors weren't actually showing — root cause was `mix-blend-mode: difference` (used for the idle cursor's auto-contrast) also applying to the hover state, which distorts any solid color it's blended against depending on what's underneath. Fixed by switching blend mode back to normal specifically while hovering, so the true blue/gold shows. Also added a terminal-style blink/pulse animation to the programmer theme's ring on hover, while the photographer's corner brackets stay static (like a camera AF box) for contrast.

## Update: welcome screen uses a "Continue" button with a crossfade, not scroll

Added an intro/welcome section (name, tagline, short bio) that shows first, right after the loading screen, as a full-screen overlay. Tried a scroll-to-reveal version (no button), but that didn't feel right — reverted to a button, relabeled "Continue," which triggers a crossfade: the welcome screen fades out while the fork (Programmer/Photographer split) fades in underneath it, instead of an instant cut or a scroll.

See `portfolio-preview-v4.html`.

## Update: hero locked, both paths now fully fleshed out

Hero fork is done for now — colors, transitions, ambient rain/polaroids all settled. Moving on to the rest of each path. Both pages now go: teaser → skills/gear → projects/gallery → [Experience or About] → Contact.

- **Weekday (programmer):** added an Experience section (work history timeline + resume download link) and a Contact section (email, LinkedIn, GitHub).
- **Weekend (photographer):** added an About section ("Behind the photos" — portrait placeholder + bio blurb) instead of formal work experience, since that fits a hobby better, plus its own Contact section (email, Instagram).

See `portfolio-preview-v4.html` for the current full build.

## Update: navy/blue base — gold now scoped to photography only

Black & gold across the whole site didn't feel right once it was built. New palette:
- **Shared base:** deep navy-black `#070B14` — this is what the 3D scene, loader, cursor, and neutral chrome use
- **Programmer identity:** white/light `#F5F7FA` for the digit-rain characters, blue `#5B8DEF` / bright blue `#8FB4FF` for tags, headings, and icon accents on that path — plus an ambient rain effect now runs continuously in the "Programmer" half of the hero itself, not just during the transition
- **Photographer identity:** kept the gold `#D4AF37` / `#F0C36B` — but now scoped only to the photography path (aperture blades, weekend-section accents), so it reads as a distinct warm identity against the shared cool base rather than the whole site's color
- **Fixed:** the aperture SVG had no explicit width/height, so it was rendering in the browser's default 300×150px box instead of full screen — blades existed but were invisible. Now sized to fill the viewport.

See `portfolio-preview-v4.html`.

## Update: black & gold, split-path structure

Locked in:
- **Palette:** near-black (`#070706`) base, gold accent (`#D4AF37`, bright gold `#F4D06F` for headlines/highlights), warm off-white text (`#F1ECDD`)
- **Tagline:** "Programmer on the weekdays, photographer on the weekends."
- **Structure:** Option A — a single-page split hero fork. Landing screen shows two hover-reactive halves (Programmer / Photographer, tagline split across them). Clicking a half triggers a cinematic gold iris-wipe transition (like a camera aperture closing then opening) that reveals a full themed section for that path — Weekday (skills, projects, PM work) or Weekend (gear, photo gallery). A back link reverses the same transition to return to the fork. One URL, one continuous 3D scene behind everything throughout.

See `portfolio-preview-v2.html` — live demo with the black/gold Three.js scene, the fork, and the iris-wipe transition working end to end.

## Update: going 3D + heavy motion

You said no generic AI-site look — you want 3D, animated, and impressive on first load. Direction locked in: a persistent WebGL scene (particle field + a noise-distorted 3D core object) sitting behind every section, with the camera dollying through it as you scroll, plus a custom cursor, magnetic buttons, and 3D tilt cards on top.

See `design-preview-3d.html` — open it in a browser, it's a real working demo (not a static image): loading sequence, animated hero text, live Three.js scene reacting to your mouse and scroll, tilt-on-hover cards.

## Tech stack

- Laravel 11 (backend, routing, mail for contact form)
- Inertia.js + React 18 (SPA feel without a separate API)
- **React Three Fiber + drei** (Three.js scene as React components — this is what the preview's raw Three.js code becomes in the real build)
- **GSAP + ScrollTrigger** (scroll-driven camera/timeline choreography — more control than CSS alone for this much motion)
- Tailwind CSS (styling)
- Ziggy (use Laravel routes in React)
- **Laravel Breeze (Inertia + React stack)** — auth scaffolding (login/logout, password reset) for a single admin account (you)
- **Spatie Laravel Media Library** — handles photo/resume uploads, auto-generates resized thumbnails for the gallery grid and polaroid animations

## Update: admin login to manage content dynamically

Content will be database-backed instead of hardcoded, so it can be edited after launch without a code deploy:

- **DB tables:** `projects`, `experience`, `testimonials`, `certifications`, `gallery_photos` (with a category column for the filter buttons), `gear_items`, plus a small `site_settings`/`stats` table for things like the welcome screen's stat row and bio text.
- **Public pages** (`/`, weekday/weekend paths) pull from these tables via Inertia props — same design, dynamic data.
- **Admin area** at `/admin/*`, protected by Laravel's `auth` middleware (Breeze-provided), with Inertia+React CRUD pages per content type — add/edit/delete a project, reorder gallery photos, swap the About bio, etc. Reuses the site's existing design system rather than a generic admin theme.
- **Sequencing:** build the public pages first with seeded placeholder data (mirrors the current static preview), then build the admin CRUD screens once the content shape is locked in — avoids rebuilding admin forms after schema changes.

## Performance & accessibility — non-negotiable given the scope

A 3D-heavy site can easily become the thing that tanks your job-hunting portfolio (slow load, laggy on older laptops, unusable on phones). Building these in from day one, not as an afterthought:

- Respect `prefers-reduced-motion` — swap the 3D scene for a static gradient/image for users who request it
- Mobile fallback — lower particle count / simpler shader (or a lightweight canvas-2D version) below a viewport/device threshold; test on a real mid-range phone, not just desktop
- Code-split the Three.js/GSAP bundle so it loads after the critical hero text and nav are visible — first paint shouldn't wait on WebGL
- Keep core content (name, title, project text) as real DOM/HTML — not baked into canvas or images — so it's readable, accessible, and indexable by search engines and recruiters' browsers with JS issues
- A loading sequence is fine (and looks intentional) but cap it — nobody waits more than ~2s for a portfolio

## Design direction: bold & creative

**Palette** — near-black base with one hot accent, so photography pops and text stays legible:
- Base: `#0B0B0F` (near-black), `#F5F3EE` (warm off-white text)
- Accent: `#FF5A3C` (coral/orange) — buttons, links, highlights
- Secondary accent: `#C6FF3D` (lime) — used sparingly for tags/badges, keeps it from feeling one-note
- Neutral grays for cards/borders: `#1A1A20`, `#2A2A32`

**Typography**
- Display/headlines: a bold condensed or grotesk font (e.g. Clash Display, Bricolage Grotesque, or General Sans) — big, confident type for the hero and section titles
- Body: Inter or Satoshi — clean and readable
- Accent/mono: JetBrains Mono for tags, dates, and code-ish details (nods to the developer side)

**Layout ideas**
- Full-bleed hero with a large photo (your own photography) and oversized name/title typography overlapping it
- Asymmetric grid for projects (not uniform 3-column cards — mix sizes for visual rhythm)
- Photography gets its own full-width masonry/grid gallery with lightbox
- Section transitions use scroll-triggered fade/slide (Framer Motion), used sparingly so it doesn't feel gimmicky

## Site structure (sections)

1. **Hero** — name, rotating/combined title ("Developer · PM · Photographer"), one-line pitch, CTA buttons (View work / Contact), background visual
2. **About** — short bio, what ties the three identities together, personal photo
3. **Skills** — grouped by identity: Dev (languages/frameworks/tools), PM (methodologies/tools), Photography (gear/style/genres)
4. **Projects** — dev + PM case studies: title, role, problem/solution, tech stack, outcome, links (repo/demo)
5. **Photography** — gallery grid, filterable by category, lightbox view
6. **Experience** — work history timeline + downloadable resume (PDF)
7. **Contact** — email, social links (LinkedIn, GitHub, Instagram), contact form (sends via Laravel Mail)

## Content checklist (what you'll need to gather)

- **Hero:** tagline, 1–2 sentence pitch, hero image
- **About:** bio paragraph (150–250 words), headshot
- **Skills:** list per category (dev/PM/photography)
- **Projects:** 3–6 projects — title, your role, description, tech/tools used, links, screenshots
- **Photography:** 15–30 curated images, organized by category, captions
- **Experience:** company, title, dates, 2–4 bullet achievements per role, resume PDF
- **Contact:** email, social handles

## Build roadmap

1. Collect content above (biggest bottleneck — can build scaffolding in parallel)
2. Scaffold Laravel + Inertia + React project, install Tailwind
3. Build design system: Tailwind config (colors/fonts above), base components (Button, Card, Section, Nav)
4. Build sections in order: Hero → About → Skills → Projects → Photography → Experience → Contact
5. Contact form backend (Laravel Mail or a service like Resend)
6. Polish: animations, responsive pass, SEO meta tags, image optimization
7. Deploy (Laravel needs PHP hosting — e.g. Forge/DigitalOcean, Render, or Railway; static export isn't an option with Inertia+Laravel)

## Next steps

Reply with any content you already have (bio, resume, project list, sample photos) and I'll start scaffolding the project — or I can generate placeholder content first so you can see the full site structure before you fill in real details.

**Repo build:** this Cowork sandbox has no PHP/Composer/root access and Packagist is blocked by its network allowlist, so a real `laravel new` can't be run from here. Plan is to scaffold the actual Laravel + Breeze (Inertia/React) project separately using Claude Code on your own machine, where PHP/Composer are already available. This plan doc and `portfolio-preview-v4.html` are the reference for that build — admin/CMS structure (DB tables, auth, upload handling) is documented above under "admin login to manage content dynamically."
