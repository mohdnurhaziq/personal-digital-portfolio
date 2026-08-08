# Development TODO — Mohd. Nur Haziq Irsyamuddin Portfolio

Build checklist for turning `portfolio-preview-v4.html` (the design reference) into the real Laravel + Inertia + React site, with an admin login for managing content. Meant to be worked through with Claude Code on your own machine, where PHP/Composer already exist — see `portfolio-plan.md` for the full design rationale behind each item here.

## Phase 0 — Content collection (do in parallel with everything else)

- [ ] Bio text for the welcome screen and both About sections (dev/PM story + photography story)
- [ ] 3–6 real projects: title, your role, problem/solution, tech used, repo/demo links, screenshots
- [ ] Real work history for the Experience timeline: company, title, dates, 2–4 achievement bullets each
- [ ] Resume PDF
- [ ] 2+ real testimonials/recommendations (worth asking a former manager or teammate)
- [ ] Certifications: name, issuing body, year
- [ ] Confirm the tech stack/tools list matches reality (Laravel, React, Node.js, TypeScript, JavaScript, MySQL, PostgreSQL, Redis, AWS, Jira, Notion, Figma — swap anything wrong)
- [ ] 15–30+ curated real photos, each tagged with a category (Portrait/Street/Landscape/Event) for the filter buttons
- [ ] Gear list confirmation: camera body, lenses, editing software
- [ ] A real portrait/profile photo (used in both About sections)
- [ ] Real contact info: email, LinkedIn, GitHub, Instagram URLs
- [ ] Photography availability/booking details
- [ ] Real stats for the welcome screen (years experience, projects shipped, photos shot)

## Phase 1 — Repo & environment setup (local machine, via Claude Code)

- [x] Confirm PHP 8.3+ (required by Laravel 13), Composer, and Node are installed locally — using Homebrew PHP 8.4.6 + Composer 2.8.8 + Node 23.7.0. **Note:** a leftover Herd install left broken shims first on `PATH`; `/opt/homebrew/bin` must come first or `php` fatals on a missing extension.
- [x] `composer create-project laravel/laravel .` — Laravel 13.24.0
- [x] Install Breeze with the Inertia + React stack (`breeze:install react`)
- [x] `npm install`, confirm the app boots — `npm run build` passes, `/` and `/login` both return 200 with Inertia rendering
- [x] `git init` + first commit
- [x] Set up `.env` and a database (SQLite), run `php artisan migrate`
- [x] Install Ziggy, React Three Fiber v9 + drei, GSAP
- [x] Move the preview iterations into a `design/` reference folder

**Breeze's scaffolding was stale for Laravel 13 and had to be corrected:**

- [x] React 18 → 19 (React Three Fiber v9 requires it). R3F peers `react >=19 <19.3`, so React 19.3 will need an R3F bump.
- [x] Tailwind 3 → 4 — Breeze wrote v3 directives *and* the v4-only Vite plugin. Removed `tailwind.config.js`/`postcss.config.js`; tokens now live in `resources/css/app.css` under `@theme` (CSS-first).
- [x] `@vitejs/plugin-react` 4 → 6 — v4 only peers up to Vite 7, and Laravel 13 ships Vite 8, so `npm install` failed outright.
- [x] `inertia-laravel` v2 → v3.3.1 to match the `@inertiajs/react` 3.x client.
- [x] Dropped `app.jsx`'s `./bootstrap` import — Laravel 13 no longer ships that file (Inertia v3 replaced Axios with its own HTTP client).
- [x] Self-hosted Bricolage Grotesque / Inter / JetBrains Mono via fontsource instead of the preview's Google Fonts CDN link.
- [ ] Still to install when the admin CMS starts: Spatie Media Library (Phase 4)

## Phase 2 — Database schema (content becomes dynamic, not hardcoded)

- [ ] Migrations: `projects`, `experience`, `testimonials`, `certifications`, `gallery_photos` (with a `category` column), `gear_items`, `site_settings` (stats, bio text, etc.)
- [ ] Eloquent models + relationships
- [ ] Seeders using the current placeholder content, so pages render something immediately
- [ ] Factories (optional, useful if you add tests later)

## Phase 3 — Public pages (port the static preview into real components)

- [ ] Welcome screen (stats + bio pulled from `site_settings`)
- [ ] Fork screen — hover dimming, ambient digit rain, flying polaroids, per-path cursor theming
- [ ] Three.js background scene as a React Three Fiber component
- [ ] Programmer page: Tech stack, Projects, Experience, About, Testimonials, Certifications, Contact — all from the DB
- [ ] Photographer page: Gear, Gallery with working category filters, About, Bookings, Contact — all from the DB
- [ ] Aperture blade-wipe and matrix-rain transitions, ported to React
- [ ] Real routing (`/`, `/programmer`, `/photographer` or similar) so links are shareable — not just JS section-swapping on one URL
- [ ] Mobile pass — actually test on a real phone this time, not just responsive CSS guesses
- [ ] Accessibility pass: `prefers-reduced-motion` support, visible keyboard focus states
- [ ] SEO: page titles, meta description, Open Graph tags per route

## Phase 4 — Auth & admin CMS

- [ ] Seed a single admin user (Breeze auth is already scaffolded from Phase 1)
- [ ] Protect `/admin/*` routes with the `auth` middleware
- [ ] Admin CRUD screens: Projects, Experience, Testimonials, Certifications, Gallery Photos, Gear, Site Settings
- [ ] Install Spatie Media Library for photo/resume uploads with auto-thumbnailing
- [ ] Basic upload validation (file type/size limits)
- [ ] Drag-and-drop gallery reordering (nice-to-have, not required for v1)

## Phase 5 — Contact form & integrations

- [ ] Contact form backend (Laravel Mail or a transactional email service)
- [ ] Basic spam protection (honeypot field or rate limiting)
- [ ] Wire up the real LinkedIn/GitHub/Instagram links

## Phase 6 — Polish & launch

- [ ] Cross-browser check
- [ ] Performance pass: lazy-load images. (Three.js/GSAP already code-split into their own chunks in `vite.config.js` — Vite 8/rolldown needs `manualChunks` in function form, the object form silently fails.)
- [ ] Lighthouse audit
- [ ] Pick a deploy target (needs PHP hosting — Forge/DigitalOcean, Render, or Railway; not static-exportable with Inertia+Laravel)
- [ ] Production `.env`, database, and switch file storage to S3 (or similar) instead of local disk
- [ ] Custom domain + SSL
- [ ] Final content pass — replace all seeded placeholder data with real content via the admin panel
