# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app
RUN mkdir -p /app/public

# First install TypeScript and ESLint (required by Next.js)
COPY package.json package-lock.json* ./
RUN npm install --save-exact --save-dev typescript @types/react @types/node eslint

# Then install all dependencies with legacy peer deps
RUN npm ci --omit=dev --legacy-peer-deps

# Copy config files
COPY tsconfig.json ./
COPY next.config.ts ./
COPY public ./public

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
