# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy the rest of the application
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Production Stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets and dependencies
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# We also need prisma in production to run migrations on boot or via separate process
# So we copy the prisma folder and node_modules from builder, but ideally we'd use a multi-stage optimized build for just prod dependencies
# Since nextjs standalone doesn't include prisma binary, we need it.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT=3000

# Server execution
CMD ["node", "server.js"]
