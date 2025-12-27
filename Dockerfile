# 1. Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (cache layer)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Build the Nuxt app
RUN npm run build

# 2. Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built app and package.json (only prod deps)
COPY package*.json ./
RUN npm install --production --legacy-peer-deps

COPY --from=builder /app/.output ./

# Expose port (default Nuxt SSR)
EXPOSE 3000

# Start Nuxt in production
CMD ["node", ".output/server/index.mjs"]
