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

- [x] Migrations — 11 tables. Beyond the ones listed here, the preview needed four more to be fully DB-driven: `stats` (welcome screen), `tech_stacks` (the icon grid), `tags` (teaser rows), `contact_links` (differs per path). Table is `experiences`, not `experience`, to match Eloquent's pluralisation.
- [x] Eloquent models — all 11, with `HasSortOrder` and `BelongsToPath` traits shared across them rather than repeating scopes. No relationships needed yet: every content type is a flat, hand-ordered list.
- [x] Seeders using the current placeholder content — `PortfolioContentSeeder`, mirroring the preview verbatim (same copy, same gallery tile order, same big/small project rhythm). Re-runnable: it clears each table first.
- [x] Admin user seeded from `ADMIN_EMAIL`/`ADMIN_PASSWORD` via `config/portfolio.php`. **No default password** — the seeder skips the user when unset, so a deploy can't fall back to a guessable credential. Set `ADMIN_PASSWORD` in `.env` before seeding.
- [x] Factories — skipped in favour of `tests/Feature/PortfolioContentSeederTest.php` (7 tests), which locks the seeded content to the preview and proves the seeder is idempotent. Factories can come later if admin CRUD tests need varied data.

## Phase 3 — Public pages (port the static preview into real components)

- [x] Welcome screen (stats + bio pulled from `site_settings`) — with the Continue crossfade into the fork
- [x] Fork screen — hover dimming, ambient digit rain, flying polaroids, per-path cursor theming (blue pulsing ring / static gold viewfinder brackets)
- [x] Three.js background scene as a React Three Fiber component — lazy-loaded, so `three` sits in its own 892 kB chunk instead of the 305 kB entry
- [x] Programmer page: Tech stack, Projects, Experience, About, Testimonials, Certifications, Contact — all from the DB
- [x] Photographer page: Gear, Gallery with working category filters, About, Bookings, Contact — all from the DB
- [x] Aperture blade-wipe and matrix-rain transitions, ported to React — they now play *over a real Inertia route change*, via a persistent `PortfolioLayout` that survives navigation. That is what keeps the cinematic feel without giving up shareable URLs.
- [x] Real routing (`/`, `/programmer`, `/photographer`) so links are shareable
- [ ] Mobile pass — actually test on a real phone this time, not just responsive CSS guesses
- [~] Accessibility pass: `prefers-reduced-motion` honoured (reveals skip straight to visible), visible `:focus-visible` ring, gallery filters are a labelled radiogroup, fork halves leave the tab order until revealed. Still needs a real screen-reader/keyboard run-through.
- [x] SEO: per-route titles, meta descriptions, Open Graph + Twitter cards, and canonical URLs, all via a shared `Seo` component. **SSR is now on**, so this is in the served HTML rather than only in the JSON payload — verified with JavaScript disabled: `/programmer` renders its `<h1>`, all seven section headings, and ~1.6k characters of real text.

**Running SSR (gotcha worth remembering):**

- `npm run build` now builds both bundles (`vite build && vite build --ssr`), then `php artisan inertia:start-ssr` runs the render process; `inertia:check-ssr` reports health.
- **SSR silently falls back to client rendering while `npm run dev` is running.** Inertia sees the Vite hot file and switches to a hot SSR URL that isn't configured, and the failure is not logged — the page just comes back with an empty `<div id="app">`. Cost an hour. To check SSR, stop the dev server (delete `public/hot`), build, then start the SSR process.
- `INERTIA_SSR_THROW_ON_ERROR=true` surfaces render failures instead of hiding them — the way to debug this.
- `app.blade.php` deliberately has no `<title>`: it would come first in document order and beat the per-page title SSR injects.

**Fidelity notes from checking against the preview in a real browser:**

- Tag rows sit *above* the first section heading, not below — `Section` takes a `preTitle` slot for this.
- Cards need the preview's 260px min-height or the grid rhythm collapses.
- Tech-stack icons come from bundled `react-icons`, not the CDN. **AWS is not in Simple Icons** (trademark removal), so it comes from `react-icons/fa`'s `FaAws`.

## Phase 4 — Auth & admin CMS

- [x] Seed a single admin user — done in Phase 2 (`DatabaseSeeder`, driven by `config/portfolio.php`).
- [x] **Public registration removed.** Breeze's `register` routes, controller, page and test are gone, so the only account is the seeded one. A test asserts `/register` 404s and creates no user.
- [x] Protect `/admin/*` with the `auth` middleware. `/dashboard` is kept as a redirect to `/admin`, because Breeze's auth controllers all redirect to that route name after login, verification and password confirmation.
- [x] Admin CRUD screens for all ten content types + site settings. Driven by definitions in `app/Admin/AdminResources.php` rather than ten near-identical controllers: a resource declares its fields once and routes, validation, the index table and the form all read from it. Adding a content type needs no new controller.
- [x] Install Spatie Media Library (11.23.4) for photo uploads with auto-thumbnailing — `thumb` (600px) and `display` (1600px) conversions, single-file collection so re-uploading replaces rather than piles up. GD is present, so conversions work.
- [x] Basic upload validation — images only (`jpeg,jpg,png,webp`), 8 MB cap, enforced server-side.
- [x] Reordering — up/down buttons persisting a new `sort_order`. Chose buttons over drag-and-drop: they work with a keyboard and on touch, which drag alone does not.
- [ ] Resume PDF upload in site settings — not done; gallery photos are the only upload so far.

**Verified in a browser, not just in tests:** edit → flash → list updates → public site reflects it; reorder persists; empty create is blocked with per-field errors; a real PNG upload generates conversions and appears in the public gallery.

**Gotcha worth remembering:** the PHP tests passed while the edit form was actually broken, because they call `$this->put()` directly and bypass the form. The bug was in `Form.jsx` — Inertia's `post()` ignores `data`/`method` passed in options, so the `_method: put` override never reached the server and updates 404'd. It has to live in the form data. Only clicking the button in a real browser caught it.

**Uploaded images need `APP_URL` to match how the site is served.** Media Library builds absolute URLs from it, so with the default `APP_URL=http://localhost` and the dev server on `127.0.0.1:8000` every uploaded image 404s. Set `APP_URL` correctly per environment.

## Phase 5 — Contact form & integrations

- [x] Contact form backend — form on both paths, sent with Laravel Mail to whatever `contact_email` is set to in site settings. Reply-To is the sender, so hitting reply just works.
- [x] **Messages are stored as well as emailed.** For a job-hunting site, losing an enquiry because SMTP was misconfigured is the worst failure mode, so the DB copy is the safety net and a mail failure is logged rather than shown to the sender. Read-only inbox at `/admin/messages`.
- [x] Spam protection — honeypot field (hidden from people and assistive tech, `prohibited` server-side) plus `throttle:5,1` on the route, so a bot that works out the trap still cannot flood the inbox.
- [x] Wire up the real LinkedIn/GitHub/Instagram links — editable in the admin under Contact links, per path. Still holding placeholder `#` URLs until real ones are supplied.

Messages record which path they came from, since a booking request reads differently to a job enquiry.

**Verified in a browser:** empty submit shows per-field errors; a real send confirms, clears the fields and moves focus to the confirmation; both messages landed in the DB with the right path and were written to the log mailer; the inbox lists them newest-first and delete works.

**Bug caught only by clicking:** the fields did not clear after a successful send — it read as "nothing happened". `wasSuccessful` in a `useEffect` did not fire reliably; moving the reset into `post()`'s `onSuccess` callback fixed it.

**Tests no longer depend on a stray SSR process.** `INERTIA_SSR_ENABLED=false` is now set in `phpunit.xml`. Before that, an assertion passed or failed depending on whether a dev SSR server happened to be running with a current bundle.

## Docker

Multi-stage `Dockerfile` with a `dev` target (source bind-mounted, Vite hot reload) and a `prod` target (assets baked in, nginx + php-fpm + the SSR renderer under supervisor). MySQL 8.4 in both. See `README.md` for commands.

**No SSR service in the dev stack, deliberately.** While Vite is serving hot assets, Inertia switches to a hot SSR URL that is not configured, so the renderer would sit idle while every page silently fell back to client rendering. Use `docker-compose.prod.yml` to exercise SSR.

**Both stacks verified end to end.**

- Dev: `/`, `/programmer`, `/photographer` all 200, `/admin` 302s to login, Vite serves on 5173, MySQL reports 22 tables, and the full suite (70 tests) passes inside the container.
- Prod: nginx + php-fpm + the SSR renderer all RUNNING under supervisor; all three pages genuinely server-rendered (checked against the DOM with the JSON payload stripped, not just `assertSee`); per-route titles correct; nginx serves hashed assets with `public, immutable` and a one-year max-age.

**Four bugs the containers exposed that nothing else would have:**

1. The `dev` stage installed no dependencies, so the anonymous `vendor`/`node_modules` volumes masked empty directories — `artisan` died on a missing autoloader and `vite` was not found. The stage now runs `composer install` and `npm ci`.
2. `composer install --no-autoloader` in that same stage meant there was no `vendor/autoload.php` at all.
3. **Vite externalises SSR dependencies by default**, so `bootstrap/ssr/ssr.js` imported `@inertiajs/react` as a bare specifier. The production image ships the SSR bundle without `node_modules`, so the renderer crashed on boot, supervisor gave up — and Inertia then silently fell back to client rendering, which is the exact failure SSR exists to prevent. Fixed with `ssr.noExternal: true` in `vite.config.js`, which bundles the dependencies in rather than shipping 400 MB of modules.
4. **Anonymous volumes are not refreshed when the image is rebuilt.** After the `dev` stage started installing dependencies, the container still booted against the *old* volume — 32 packages, the production set — while the host's bind-mounted `bootstrap/cache/packages.php` listed the host's packages. The result was `Class "Laravel\Pail\PailServiceProvider" not found`, which points at nothing useful. Fixed in two places: `docker/entrypoint.sh` stamps the lock file hash into `vendor/.lock-stamp` and `node_modules/.lock-stamp` and reinstalls when it drifts, and `bootstrap/cache` is now its own anonymous volume so the host's derived state stops leaking in. The entrypoint also deletes `packages.php`/`services.php` on every boot — they are regenerable, and a wrong one is worse than a stale one.

   **Not yet re-verified in a container.** Docker Desktop's daemon stopped coming up on this machine (host disk at 99%, ~3 GB free) and three restart attempts failed, so this fix is reasoned from a confirmed diagnosis rather than observed working. Re-run `docker compose down -v && docker compose up --build` once there is disk headroom.

**Docker's own storage broke during this.** When the host disk filled, containerd's content store started throwing `input/output error` on every command — even `docker images`. Restarting Docker Desktop cleared it, and `docker builder prune -af` reclaimed 8.7 GB. Build cache only: regenerable, and it touches no images, volumes or containers — which mattered, because other projects' containers were running at the time, so a broad prune or a Docker reset was never an option.

## Phase 6 — Polish & launch

- [ ] Cross-browser check
- [ ] Performance pass: lazy-load images. (Three.js/GSAP already code-split into their own chunks in `vite.config.js` — Vite 8/rolldown needs `manualChunks` in function form, the object form silently fails.)
- [ ] Lighthouse audit
- [ ] Pick a deploy target (needs PHP hosting — Forge/DigitalOcean, Render, or Railway; not static-exportable with Inertia+Laravel)
- [ ] Production `.env`, database, and switch file storage to S3 (or similar) instead of local disk
- [ ] Custom domain + SSL
- [ ] Final content pass — replace all seeded placeholder data with real content via the admin panel
