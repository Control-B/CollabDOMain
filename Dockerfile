## Root Dockerfile forwarding to apps/landing
# This Dockerfile is provided for platforms that always build from repo root.
# Preferred: set Build Context = apps/landing and Dockerfile path = apps/landing/Dockerfile.

FROM node:20-alpine AS deps
WORKDIR /app
COPY apps/landing/package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/landing/ ./
ENV NEXT_EXPORT=false
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001

# Copy minimal runtime files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
