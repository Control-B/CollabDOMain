# Simple Landing Page Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY apps/landing/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY apps/landing/ .

# Build the application
RUN npm run build

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Create user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Start the application
CMD ["npm", "start"]
