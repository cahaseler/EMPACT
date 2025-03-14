FROM node:alpine AS deps

WORKDIR /usr/src/app

# Copy the standalone Next.js output with Prisma binaries
COPY ./.next/standalone /usr/src/app

# Make sure Prisma engine can be executed
RUN apk add --no-cache openssl3
RUN chmod +x /usr/src/app/.prisma/client/libquery_engine-* || true

ENV NODE_ENV=production \
    PORT=3000 \
    PRISMA_QUERY_ENGINE_LIBRARY=/usr/src/app/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node

EXPOSE 3000

# Use a non-root user for security
USER node

CMD ["node", "server.js"]
