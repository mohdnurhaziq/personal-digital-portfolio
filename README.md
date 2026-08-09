# Personal portfolio — Mohd. Nur Haziq Irsyamuddin

Programmer on the weekdays, photographer on the weekends. A single-page fork
into two themed paths, backed by an owner-only CMS so the content can change
without a deploy.

**Stack:** Laravel 13 · Inertia v3 · React 19 · Tailwind v4 · React Three Fiber
· Spatie Media Library · MySQL

- `design/` — the static HTML previews this was ported from; still the visual
  reference.
- `portfolio-plan.md` — design rationale and decisions.
- `development-todo.md` — build checklist and what is left.

## Running it

Docker is the only supported way to run this, and MySQL 8.4 is the only
database. There is deliberately no SQLite fallback: the app used to run either
way, each with its own store, and “which database am I on?” silently had two
answers — see `development-todo.md` for the two bugs that cost.

```bash
cp .env.example .env
docker compose up --build
```

Then:

| URL | What |
| --- | --- |
| http://localhost:8000 | The site |
| http://localhost:8000/admin | The CMS (log in first) |
| http://localhost:5173 | Vite dev server (assets, hot reload) |

The database is created and migrated on boot. To load the placeholder content
and create the owner account:

```bash
docker compose exec app php artisan db:seed
```

`ADMIN_PASSWORD` must be set in `.env` first — the seeder deliberately skips
creating the account when it is empty, so a deploy can never fall back to a
guessable credential.

### Everyday commands

```bash
docker compose exec app php artisan test
docker compose exec app php artisan migrate
docker compose exec app vendor/bin/pint
docker compose exec app bash
```

### Server-side rendering

The dev stack **does not** run the SSR renderer, and that is deliberate: while
Vite is serving hot assets, Inertia switches to a hot SSR URL that is not
configured, so an SSR process would sit idle while every page quietly fell back
to client rendering. Nothing is logged when this happens — the page just comes
back with an empty `<div id="app">`.

To exercise SSR, run the production stack, which serves prebuilt assets and runs
the renderer under supervisor:

```bash
docker compose -f docker-compose.prod.yml up --build
# http://localhost:8080
```

Confirm it is actually rendering rather than silently falling back:

```bash
curl -s http://localhost:8080/programmer | grep -c '<h1'
```

A `1` means the HTML really contains the heading. A `0` means SSR fell back and
only the JSON payload is being served.

## Configuration worth getting right

| Variable | Why it matters |
| --- | --- |
| `APP_URL` | Media Library builds **absolute** URLs from it. If it does not match how the site is served, every uploaded image 404s. |
| `APP_NAME` | Appears in every page title, e.g. "Photography — {APP_NAME}". |
| `ADMIN_PASSWORD` | The seeder skips creating the owner account when unset. No default on purpose. |
| `MAIL_MAILER` | Defaults to `log`, so contact messages are written to the log rather than sent. Set real credentials before launch. |

Contact messages are stored as well as emailed, and readable at
`/admin/messages` — losing an enquiry to a misconfigured mailer is the worst
failure mode for a job-hunting site.

## Running artisan from the host

Optional — handy for tinker and one-off commands without `docker compose exec`.
The stack must be up, because the database lives in the container.

```bash
composer install
php artisan tinker
```

The host reaches MySQL on `127.0.0.1:${DB_PORT_HOST}`, published by the `db`
service; inside the container Compose overrides `DB_HOST` with the service name
`db`. Both therefore talk to the same database.

> **The published port is 3307, not 3306.** A Homebrew MySQL was already
> listening on 127.0.0.1:3306, so the container could only bind IPv6 and
> host-side connections silently reached the *wrong server* — "Access denied
> for user 'portfolio'@'localhost'" from a MySQL that has no such user. Change
> `DB_PORT_HOST` and `DB_PORT` together if 3307 is taken too.

> Serving the site itself with `php artisan serve` is not supported. It needs
> Vite, the storage link and a matching `APP_URL`, all of which the container
> already sets up.

> The storage link is made **relative** on purpose. The Docker stack
> bind-mounts the repo, so `php artisan storage:link` writes an absolute
> `/var/www/html/...` — valid in the container, dangling on the host, and every
> uploaded image 404s. If you have already hit that, `rm public/storage` and run
> the `ln` above. (`storage:link --relative` does the same thing, but needs
> `composer require symfony/filesystem`.)

> `APP_URL` must match how you actually reach the site, port included. Media
> Library builds **absolute** URLs from it, so serving on `:8123` while
> `APP_URL` says `http://localhost` gives you a page of broken images.

> On a machine with a leftover Herd install, the stale shims on `PATH` break
> bare `php`/`composer`. Put Homebrew first: `export PATH=/opt/homebrew/bin:$PATH`.
