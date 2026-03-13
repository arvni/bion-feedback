#!/bin/bash
set -e

# Create necessary directories if they don't exist
mkdir -p /app/storage/app/public
mkdir -p /app/storage/app/private
mkdir -p /app/storage/framework/cache/data
mkdir -p /app/storage/framework/sessions
mkdir -p /app/storage/framework/views
mkdir -p /app/storage/logs
mkdir -p /app/bootstrap/cache

# Set proper permissions
chmod -R 775 /app/storage
chmod -R 775 /app/bootstrap/cache

# Wait for MySQL to be ready
if [ -n "$DB_HOST" ]; then
    echo "Waiting for database at $DB_HOST:${DB_PORT:-3306}..."
    for i in $(seq 1 30); do
        if php -r "
            try {
                new PDO(
                    'mysql:host=${DB_HOST};port=${DB_PORT:-3306};dbname=${DB_DATABASE}',
                    '${DB_USERNAME}',
                    '${DB_PASSWORD}'
                );
                exit(0);
            } catch (Exception \$e) {
                exit(1);
            }
        " 2>/dev/null; then
            echo "Database is ready!"
            break
        fi
        echo "Database not ready, waiting... ($i/30)"
        sleep 2
    done
fi

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Run Laravel optimizations
echo "Running Laravel optimizations..."
php artisan config:cache  2>/dev/null || true
php artisan route:cache   2>/dev/null || true
php artisan view:cache    2>/dev/null || true
php artisan optimize

# Determine which service to run based on CONTAINER_ROLE
role=${CONTAINER_ROLE:-app}

case "$role" in
    app)
        echo "Starting application server..."
        exec "$@"
        ;;
    queue)
        echo "Starting queue worker..."
        exec php artisan queue:work --sleep=3 --tries=3 --max-time=3600
        ;;
    scheduler)
        echo "Starting scheduler..."
        while true; do
            php artisan schedule:run --verbose --no-interaction &
            sleep 60
        done
        ;;
    *)
        echo "Unknown CONTAINER_ROLE: $role"
        exit 1
        ;;
esac
