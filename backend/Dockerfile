# Backend Dockerfile
FROM oven/bun:1-alpine AS base

WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bunx prisma generate
RUN bun run build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'bunx prisma migrate deploy' >> /app/start.sh && \
    echo 'bunx prisma db seed || true' >> /app/start.sh && \
    echo 'bun run start:prod' >> /app/start.sh && \
    chmod +x /app/start.sh

EXPOSE 3001

CMD ["/app/start.sh"]
