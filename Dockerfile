# Stage 1: Build assets and dependencies
FROM php:8.2-alpine AS builder

ENV COMPOSER_ALLOW_SUPERUSER=1 \
    PHP_MEMORY_LIMIT=256M \
    UPLOAD_MAX_FILESIZE=20M \
    POST_MAX_SIZE=22M \
    PSYSH_HISTORY_FILE=/dev/null \
    PSYSH_CONFIG_FILE=/dev/null \
    PSYSH_MANUAL_DB_FILE=/dev/null

RUN apk --no-cache add \
        zlib \
        libzip-dev \
        libpng-dev \
        libsodium \
        libsodium-dev \
        jpeg-dev \
        freetype-dev \
        libwebp-dev \
        icu \
        icu-dev \
        g++ \
        make \
        oniguruma-dev \
        linux-headers \
        libxml2-dev \
        bash \
        git \
        nodejs \
        npm \
        $PHPIZE_DEPS && \
    docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp && \
    docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        sodium \
        zip \
        gd \
        intl \
        bcmath \
        opcache \
        pcntl && \
    pecl install redis && \
    docker-php-ext-enable redis opcache

RUN npm install -g npm@latest
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Install PHP dependencies
COPY composer.* ./
RUN composer install --no-interaction --prefer-dist --no-scripts --no-dev --no-autoloader

# Install Node dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Finalise composer autoloader
RUN composer dump-autoload --optimize --no-dev

# Stage 2: Production image
FROM php:8.2-alpine

ENV PHP_MEMORY_LIMIT=256M \
    UPLOAD_MAX_FILESIZE=20M \
    POST_MAX_SIZE=22M \
    CONTAINER_ROLE=app \
    APP_ENV=production \
    PORT=8000 \
    PSYSH_HISTORY_FILE=/dev/null \
    PSYSH_CONFIG_FILE=/dev/null \
    PSYSH_MANUAL_DB_FILE=/dev/null

# Copy compiled PHP extensions from builder
COPY --from=builder /usr/local/lib/php/extensions /usr/local/lib/php/extensions
COPY --from=builder /usr/local/etc/php/conf.d     /usr/local/etc/php/conf.d

RUN apk --no-cache add \
        zlib \
        libzip \
        libpng \
        libsodium \
        jpeg \
        freetype \
        libwebp \
        icu \
        bash \
        curl && \
    echo "memory_limit=${PHP_MEMORY_LIMIT}"           >  /usr/local/etc/php/conf.d/app.ini && \
    echo "upload_max_filesize=${UPLOAD_MAX_FILESIZE}"  >> /usr/local/etc/php/conf.d/app.ini && \
    echo "post_max_size=${POST_MAX_SIZE}"              >> /usr/local/etc/php/conf.d/app.ini && \
    echo "opcache.enable=1"                            >> /usr/local/etc/php/conf.d/app.ini && \
    echo "opcache.validate_timestamps=0"               >> /usr/local/etc/php/conf.d/app.ini

WORKDIR /app
COPY --from=builder /app /app

RUN mkdir -p /app/storage/app/public \
             /app/storage/app/private \
             /app/storage/framework/cache/data \
             /app/storage/framework/sessions \
             /app/storage/framework/views \
             /app/storage/logs \
             /app/bootstrap/cache && \
    chmod -R 777 /app/storage && \
    chmod -R 777 /app/bootstrap/cache

COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/up || exit 1

ENTRYPOINT ["entrypoint"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
