# syntax=docker/dockerfile:1.7

# ---------------------------------------------------------------------------
# base — PHP with the extensions this project actually needs, plus Node.
#
# Node lives in the image rather than in a separate container because the SSR
# renderer is a long-running node process that has to sit next to the app.
# ---------------------------------------------------------------------------
FROM php:8.4-fpm-bookworm AS base

ENV DEBIAN_FRONTEND=noninteractive \
    COMPOSER_ALLOW_SUPERUSER=1 \
    COMPOSER_NO_INTERACTION=1

RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates curl git gnupg unzip \
        # gd is what Media Library uses to build the gallery thumbnails
        libfreetype6-dev libjpeg62-turbo-dev libpng-dev libwebp-dev \
        libzip-dev libicu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j"$(nproc)" gd zip intl pdo_mysql exif opcache \
    && rm -rf /var/lib/apt/lists/*

# Node 22 LTS: builds the assets and runs the SSR process.
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# ---------------------------------------------------------------------------
# vendor — PHP dependencies, cached on the lock file alone.
# ---------------------------------------------------------------------------
FROM base AS vendor

COPY composer.json composer.lock ./
RUN --mount=type=cache,target=/tmp/composer \
    COMPOSER_CACHE_DIR=/tmp/composer \
    composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# ---------------------------------------------------------------------------
# assets — the client bundle and the SSR bundle.
# ---------------------------------------------------------------------------
FROM base AS assets

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY resources ./resources
COPY vite.config.js jsconfig.json ./
# Vite needs the page components to resolve the per-page entries.
RUN npm run build

# ---------------------------------------------------------------------------
# dev — the source is bind-mounted at run time, but dependencies are installed
# here. compose masks vendor/ and node_modules/ with anonymous volumes so the
# Linux builds from this image survive the bind mount rather than being shadowed
# by whatever the macOS host has (node's are native binaries and differ).
# ---------------------------------------------------------------------------
FROM base AS dev

RUN apt-get update && apt-get install -y --no-install-recommends \
        default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

# Run as the host user so files written in the container (migrations, media,
# logs) do not come back owned by root.
ARG UID=1000
ARG GID=1000
RUN groupadd -g "${GID}" app 2>/dev/null || true \
    && useradd -u "${UID}" -g "${GID}" -m -s /bin/bash app 2>/dev/null || true

COPY docker/php/php.ini /usr/local/etc/php/conf.d/99-app.ini
COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

# Dev dependencies included: this is where phpunit and pint run.
COPY composer.json composer.lock ./
# The autoloader is generated here. PSR-4 maps namespaces to paths, so it
# resolves against the bind-mounted source at run time; scripts are skipped
# because the application code is not in this layer yet.
RUN composer install --no-scripts --prefer-dist

COPY package.json package-lock.json ./
RUN npm ci

RUN chown -R "${UID}:${GID}" /var/www/html

USER app
EXPOSE 8000 5173
ENTRYPOINT ["entrypoint"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

# ---------------------------------------------------------------------------
# prod — nginx + php-fpm + the SSR renderer, under supervisor.
# ---------------------------------------------------------------------------
FROM base AS prod

RUN apt-get update && apt-get install -y --no-install-recommends \
        nginx supervisor \
    && rm -rf /var/lib/apt/lists/*

COPY docker/php/php.ini /usr/local/etc/php/conf.d/99-app.ini
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/99-opcache.ini
COPY docker/nginx/default.conf /etc/nginx/sites-available/default
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/app.conf

COPY --from=vendor /var/www/html/vendor ./vendor
COPY . .
COPY --from=assets /var/www/html/public/build ./public/build
COPY --from=assets /var/www/html/bootstrap/ssr ./bootstrap/ssr

RUN composer dump-autoload --optimize --no-dev \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwX storage bootstrap/cache

COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

EXPOSE 80
ENV APP_ENV=production APP_DEBUG=false
ENTRYPOINT ["entrypoint"]
CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf", "-n"]
