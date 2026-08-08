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
