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

# Uploaded media is served from public/storage; the symlink lives inside the
# container, so it has to be created on every boot.
php artisan storage:link 2>/dev/null || true

exec "$@"
