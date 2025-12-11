# Stage 1: PHP + composer build
FROM php:8.2-fpm AS builder

RUN apt-get update && apt-get install -y \
    zip unzip git curl libpng-dev libonig-dev libxml2-dev && \
    docker-php-ext-install pdo pdo_mysql

WORKDIR /var/www/html

# انسخي كل محتويات مجلد backend
COPY . .

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN composer install --no-dev --optimize-autoloader

# Stage 2
FROM php:8.2-fpm

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    zip unzip libpng-dev libonig-dev libxml2-dev && \
    docker-php-ext-install pdo pdo_mysql

COPY --from=builder /var/www/html .

EXPOSE 80

CMD ["php", "-S", "0.0.0.0:80", "-t", "public"]
