# Stage 1: Builder
FROM node:18-alpine AS builder

# Better: pin exact node version (for reproducibility)
ARG NODE_ENV=production

WORKDIR /app
RUN mkdir -p /app/public

# Copy dependency files first to leverage Docker cache
COPY package.json package-lock.json ./

# Install all dependencies (both prod & dev)
RUN npm ci

# Copy rest of the application code
COPY . .

# Build Next.js
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Copy only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built output and public files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
