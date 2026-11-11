# ===================================================
# AI SAMRAT ASSESSMENT HUB - FRONTEND DOCKERFILE
# Multi-stage Node 20 / Vite / Nginx Production Build
# ===================================================

# Stage 1: Build static assets
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Minimal Nginx web server
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built frontend assets
COPY --from=builder /app/dist .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

