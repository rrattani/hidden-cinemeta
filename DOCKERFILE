# Stage 1: Builder (with TypeScript)
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.ts ./  # TypeScript config file
COPY public ./public

# Install dependencies (including TypeScript)
RUN npm ci

# Copy source files
COPY . .

# Build Next.js (compiles TS files and next.config.ts)
RUN npm run build

# ----------------------------------
# Stage 2: Production
# ----------------------------------
FROM node:18-alpine AS runner
WORKDIR /app

# Copy production artifacts
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./  # Compiled config
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Runtime settings
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
