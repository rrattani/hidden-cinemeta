# Stage 1: Builder
FROM node:18-alpine AS builder

# Create all directories first
WORKDIR /app
RUN mkdir -p /app/public

# Copy ONLY dependency-related files first (for better caching)
COPY package.json package-lock.json* ./
COPY tsconfig.json ./
COPY next.config.ts ./

# Install dependencies (use --omit=dev for production)
RUN npm ci --omit=dev

# Copy everything else and build
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app

# Copy production artifacts
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
