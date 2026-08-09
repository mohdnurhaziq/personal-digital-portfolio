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
- [x] Spatie Media Library — installed in Phase 4, and now carries the resume PDF as well as gallery photos.

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
- [x] Accessibility pass: `prefers-reduced-motion` honoured (reveals skip straight to visible), gallery filters are a labelled radiogroup, fork halves leave the tab order until revealed, gallery images carry alt text and lazy-load, heading order runs H1 → H2 → H3 with no skips.

  A keyboard run-through in Chrome then turned up five things the test suite could not see, all now fixed and re-verified in the browser:

  - **The focus ring was invisible on the photographer path.** It was hard-coded to `--color-dev-bright` (`#8fb4ff`), which measures **1.93:1** against the cream ground — under the 3:1 WCAG 2.2 asks of a focus indicator. It is now a `--focus-ring` variable that light surfaces override with a deep gold, measured in-browser at **4.99:1**.
  - **No `<main>` landmark on either path page.** Only the landing screen had one, so landmark navigation dropped a screen-reader user into undifferentiated content. Both paths now wrap their content in `<main id="content">`, with the nav left outside it.
  - **No skip link.** Reaching the content past the nav and hero meant tabbing through them on every visit. `PageNav` now renders one as the first focusable element, visible only on focus, and it moves focus onto `<main>` rather than only scrolling.
  - **Pressing Continue stranded focus.** The welcome panel becomes `aria-hidden` when the fork opens, but the button that triggered it kept focus inside that subtree — which browsers refuse to honour. Focus is now handed to the first fork half, and the button leaves the tab order.
  - **The fork halves' focus outline was drawn off-screen.** Each half fills its side of the viewport, so the ring sat on the screen edges; it is now inset.

  Still outstanding: an actual screen-reader pass (VoiceOver/NVDA) and a run on a real phone — neither is something I can do from here.
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
- [x] Resume PDF upload in site settings. `site_settings` gained a `file` type, and `SiteSetting` is now a media owner (single-file `file` collection, `application/pdf` only), so the setting rows stay the one registry of everything editable rather than needing a table of their own. The form gets an upload field, a link to what is already there with its size and date, and a remove checkbox.

  **The file is served by a route, `GET /resume`, not by a link to the media URL.** Three reasons: the link survives a re-upload, the download lands as `mohd-nur-haziq-irsyamuddin-resume.pdf` rather than a storage hash, and — unlike Media Library's absolute URLs — it does not break when the site is served on a port `APP_URL` does not name. The existing `resume_url` setting stays as an escape hatch for a resume hosted elsewhere; `SiteSetting::publicValues()` overrides it with the route when a PDF is attached, so the Programmer page keeps reading one key and never learns where the file came from.

  Validation is doubled up on purpose: `mimetypes:application/pdf` checks what the file *is*, `mimes:pdf` checks what it is *called*, and the media collection sniffs the stored file a third time. That third check is why `UploadedFile::fake()->create(…, 'application/pdf')` does not work in the tests — the fake claims a mime type but is zero bytes, so it lands as `application/x-empty`. The test writes real PDF bytes instead.

**Verified in a browser, not just in tests:** edit → flash → list updates → public site reflects it; reorder persists; empty create is blocked with per-field errors; a real PNG upload generates conversions and appears in the public gallery. For the resume: a real PDF uploads and saves, the field then lists it with size and date, `/resume` returns it as `application/pdf` `inline` with the owner-name filename, the Programmer page's download button appears pointing at the port-correct `/resume`, a `.txt` is rejected with "The file must be a PDF." while the existing upload is left alone, and ticking remove clears the row, deletes the file from disk and takes `/resume` back to a 404.

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

**Seven bugs the containers exposed that nothing else would have:**

1. The `dev` stage installed no dependencies, so the anonymous `vendor`/`node_modules` volumes masked empty directories — `artisan` died on a missing autoloader and `vite` was not found. The stage now runs `composer install` and `npm ci`.
2. `composer install --no-autoloader` in that same stage meant there was no `vendor/autoload.php` at all.
3. **Vite externalises SSR dependencies by default**, so `bootstrap/ssr/ssr.js` imported `@inertiajs/react` as a bare specifier. The production image ships the SSR bundle without `node_modules`, so the renderer crashed on boot, supervisor gave up — and Inertia then silently fell back to client rendering, which is the exact failure SSR exists to prevent. Fixed with `ssr.noExternal: true` in `vite.config.js`, which bundles the dependencies in rather than shipping 400 MB of modules.
4. **Anonymous volumes are not refreshed when the image is rebuilt.** After the `dev` stage started installing dependencies, the container still booted against the *old* volume — 32 packages, the production set — while the host's bind-mounted `bootstrap/cache/packages.php` listed the host's packages. The result was `Class "Laravel\Pail\PailServiceProvider" not found`, which points at nothing useful. Fixed in two places: `docker/entrypoint.sh` stamps the lock file hash into `vendor/.lock-stamp` and `node_modules/.lock-stamp` and reinstalls when it drifts, and `bootstrap/cache` is now its own anonymous volume so the host's derived state stops leaking in. The entrypoint also deletes `packages.php`/`services.php` on every boot — they are regenerable, and a wrong one is worse than a stale one.

   Verified: rebuilt with `down -v`, then rebuilt *again* with the volumes retained — the exact condition that produced the bug — and the app boots clean both ways. `vendor/laravel` in the container now lists `pail`, and the suite passes at 70/70 inside it.

5. **An anonymous volume is seeded from the image, not created empty.** Adding the `bootstrap/cache` volume above then broke the boot a different way: that directory does not exist in the `dev` stage (only the lock files are copied in), so Docker created it root-owned while the container runs as `app`, and package discovery died on `The /var/www/html/bootstrap/cache directory must be present and writable`. The stage now runs `mkdir -p bootstrap/cache` before the `chown`.

6. **`storage:link` printed `ERROR` on every single boot.** The symlink lives in the bind-mounted repo, so it already exists on the second and every later boot. `2>/dev/null || true` did not suppress it because artisan writes that message to *stdout*, so every routine boot looked like a failure.

7. **The storage symlink pointed at a path that exists only in the container.** Chasing (6) turned up the more serious version of it. `artisan storage:link` writes an *absolute* target — `/var/www/html/storage/app/public` — and because the repo is bind-mounted, that link is written straight into the host's working tree. It resolves in the container and dangles on the host, so every uploaded image 404s for anyone running the app outside Docker. The entrypoint now makes the link relative (`ln -s ../storage/app/public public/storage`), which resolves on both sides, and recreates it each boot rather than trusting one an older image may have left behind. Verified: resolves in the container *and* on the host, and the host now serves `/storage/…` with a 200 where it previously returned 403.

   `ln` rather than `artisan storage:link --relative`, because that flag needs `symfony/filesystem`, which is not installed — a one-time setup command is a poor reason to add a production dependency.

**An eighth, found on a later run — and the worst of them, because everything looked fine.** `artisan serve` spawns the PHP development server as a child process with a *filtered* environment: `ServeCommand::$passthroughVariables` is an allowlist, and anything not on it is stripped. `DB_*` and `APP_URL` are not on it.

So in the dev stack, Compose set `DB_CONNECTION=mysql` on the container and the entrypoint's `php artisan migrate` — a direct call, full environment — duly migrated MySQL. But every HTTP request is served by the *child*, which never saw those variables and fell back to the bind-mounted `.env`: `DB_CONNECTION=sqlite`. The container was serving the host's `database/database.sqlite` while reporting a healthy, migrated MySQL beside it.

Nothing about this is visible from outside. All three pages return 200, the suite passes inside the container (artisan again, so MySQL), and `docker compose exec … tinker` reads MySQL too — so every probe that would normally catch it agrees with the wrong answer. What gave it away was the photographer page: one gallery image 404ing against `http://localhost/storage/…`, a URL with no port, built from the `.env` `APP_URL` — and that photo existed only in the host's SQLite file, not in MySQL at all.

Fixed in `AppServiceProvider`, which appends the container's variables to the allowlist. Verified by the same disagreement disappearing: the served page now returns the MySQL rows (eight seeded photos, no media, `thumb_url: null`) where it previously returned SQLite's, and the photographer page renders with zero console errors.

The general lesson for the earlier `APP_URL` note further up: with `artisan serve`, setting `APP_URL` in the *environment* does nothing. It has to be in `.env`, or on this allowlist.

**Docker's own storage broke during this.** When the host disk filled, containerd's content store started throwing `input/output error` on every command — even `docker images`. Restarting Docker Desktop cleared it, and `docker builder prune -af` reclaimed 8.7 GB. Build cache only: regenerable, and it touches no images, volumes or containers — which mattered, because other projects' containers were running at the time, so a broad prune or a Docker reset was never an option.

## Bug sweep

A pass over every surface with the app actually running, rather than reading code. One real bug (the storage symlink, item 7 above); everything else checked out.

Verified working: contact form end to end — submits, stores, mails to the log, clears the fields, shows the confirmation and moves focus to it; the honeypot is genuinely hidden (`display:none` on the wrapper, `aria-hidden`, `tabIndex -1`); `throttle:5,1` and CSRF are both live on `POST /contact`; all 14 admin routes carry `Illuminate\Auth\Middleware\Authenticate`; all 14 admin pages render 200 with zero console output, including the resource edit form and the image upload field; unknown URLs 404; both admin forms already coerce nullable columns with `?? ''`; prod stack healthy with supervisor running php-fpm, nginx and the SSR renderer, and `/programmer` genuinely server-rendered.

Two things that look like problems and are not:

- `THREE.Clock: This module has been deprecated` — a deprecation notice from three 0.185 reached through `@react-three/fiber` 9.7's own `state.clock`. Not our call site, and not fixable without an upstream release.
- Broken gallery images when the site is reached on a port that `APP_URL` does not name. Media Library builds **absolute** URLs, so serving on `:8123` while `APP_URL` says `http://localhost` gives a page of 404s. Config, not code — now called out in the README.

The 189 `ERROR` lines in `storage/logs/laravel.log` are historical, from development, and include failures already fixed (the `bootstrap/cache` permission error, and a React controlled-input warning from before both admin forms gained their `?? ''` guards).

## Phase 6 — Polish & launch

- [ ] Cross-browser check
- [x] Performance pass. Gallery images already carry `loading="lazy"`. Two real defects, both found by measuring in the browser rather than reading the config:

  - **React was inside the `three` chunk.** `manualChunks` named `three` and `gsap` but left React unnamed, so rolldown folded the shared React runtime into `three` — the built chunk held `createRoot` and `Scheduler` alongside `WebGLRenderer`. The manifest then listed `three` as a *static* import of `AdminLayout`, `ApplicationLogo`, `GuestLayout` and `Photographer`, and it was emitted as a `<link rel="modulepreload">` in the head. Every page in the app, login included, fetched 872 KB of WebGL at high priority to render a form. React now has its own named chunk; `three` is statically imported only by the lazily-loaded `Scene.jsx` and appears in no page's head preloads.
  - **The photographer path kept the 3D scene running.** Hiding it only faded it to `opacity-0`, so an invisible WebGL render loop ran behind an opaque cream ground. `PortfolioLayout` now takes a `scene` prop — read as *initial state*, because an effect runs a beat too late to stop the chunk being requested — and `Photographer.layout` passes `scene={false}`. `BackgroundScene` unmounts rather than fading, with the unmount trailing the 700ms transition so the landing page's hand-off to the fork still cross-fades. Verified: mounted before, still mounted mid-fade, gone after.

  **Not a bug, worth knowing:** every page still pulls the whole manifest (~1.3 MB, three included) *after* load. That is `Vite::prefetch(concurrency: 3)` in `AppServiceProvider` — a deliberate Laravel feature that fetches at `rel=prefetch` (idle) priority so later SPA navigations are instant. It does not block first paint. Drop it or lower the concurrency if mobile data cost matters more than instant navigation.
- [ ] Lighthouse audit
- [ ] Pick a deploy target (needs PHP hosting — Forge/DigitalOcean, Render, or Railway; not static-exportable with Inertia+Laravel)
- [ ] Production `.env`, database, and switch file storage to S3 (or similar) instead of local disk
- [ ] Custom domain + SSL
- [ ] Final content pass — replace all seeded placeholder data with real content via the admin panel
