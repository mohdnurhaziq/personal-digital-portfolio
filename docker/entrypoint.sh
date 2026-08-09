#!/usr/bin/env bash
set -euo pipefail

# Wait for MySQL before touching the database. Without this the first `migrate`
# races the db container's own startup and fails on a cold `docker compose up`.
if [ "${DB_CONNECTION:-}" = "mysql" ]; then
    printf 'Waiting for database at %s:%s' "${DB_HOST:-db}" "${DB_PORT:-3306}"

    for _ in $(seq 1 60); do
        if php -r '
            $h = getenv("DB_HOST") ?: "db";
            $p = getenv("DB_PORT") ?: "3306";
            exit(@fsockopen($h, (int) $p, $e, $s, 1) ? 0 : 1);
        ' 2>/dev/null; then
            printf ' ready\n'
            break
        fi

        printf '.'
        sleep 1
    done
fi

# --- dependency self-heal -------------------------------------------------
#
# Only in dev, where vendor/ and node_modules/ live in anonymous volumes.
# Those volumes are NOT refreshed when the image is rebuilt, so a container can
# boot against dependencies from an older image — which surfaces as confusing
# "class not found" errors rather than anything obviously stale. Stamping the
# lock file hash makes the container repair itself instead.
if [ "${APP_ENV:-local}" != "production" ]; then
    if [ -f composer.lock ]; then
        want="$(md5sum composer.lock | cut -d' ' -f1)"
        have="$(cat vendor/.lock-stamp 2>/dev/null || true)"

        if [ ! -f vendor/autoload.php ] || [ "$want" != "$have" ]; then
            echo "Composer dependencies are stale — installing."
            composer install --no-interaction --prefer-dist
            printf '%s' "$want" > vendor/.lock-stamp
        fi
    fi

    if [ -f package-lock.json ]; then
        want="$(md5sum package-lock.json | cut -d' ' -f1)"
        have="$(cat node_modules/.lock-stamp 2>/dev/null || true)"

        if [ ! -d node_modules/vite ] || [ "$want" != "$have" ]; then
            echo "Node dependencies are stale — installing."
            npm ci
            printf '%s' "$want" > node_modules/.lock-stamp
        fi
    fi

    # Derived state. The host's copy lists packages installed on the host, which
    # are not necessarily the ones in this container.
    rm -f bootstrap/cache/packages.php bootstrap/cache/services.php
fi

if [ ! -f .env ]; then
    echo "No .env found — copying .env.example."
    cp .env.example .env
fi

if ! grep -qE '^APP_KEY=.+' .env; then
    php artisan key:generate --force
fi

php artisan migrate --force

# Uploaded media is served from public/storage, and the link has to exist
# inside the container.
#
# The link is made relative, which matters more than it looks. The repo is
# bind-mounted, so `artisan storage:link` writes an absolute
# /var/www/html/storage/app/public — a path that exists only in the container —
# straight into the host's working tree. Anyone then running the app on the host
# gets a dangling symlink and a 404 for every uploaded image. A relative link
# resolves on both sides.
#
# ln rather than `artisan storage:link --relative`: that flag needs
# symfony/filesystem, and a one-time setup command is a poor reason to add a
# production dependency. The container is Linux, so ln is unambiguous here.
#
# Recreated rather than trusted, because an absolute link left behind by an
# older image still resolves in here and so would never be noticed.
if [ -L public/storage ]; then
    rm -f public/storage
fi

ln -s ../storage/app/public public/storage

exec "$@"
