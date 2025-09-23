# Landing Page Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Ensure we build for standalone
ENV NEXT_EXPORT=false
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Use PORT from environment or default to 3000
ENV PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application - try standalone first, fallback to regular build
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Try to copy standalone, if it doesn't exist, copy regular Next.js files
RUN mkdir -p /app/.next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone* ./
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

# Expose the port that will be used
EXPOSE $PORT

# Try standalone server first, fallback to next start
CMD if [ -f "./server.js" ]; then node server.js; else npx next start; fi
