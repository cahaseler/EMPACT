# Builder stage
FROM node:22.11.0-slim AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the source code
COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=prisma/mssql/schema.prisma

# Build Next.js app
RUN yarn build

# Set up standalone Next.js output
RUN cp -rf public .next/standalone/public && \
    cp -rf .next/static .next/standalone/.next/static && \
    mkdir -p .next/standalone/.prisma && \
    cp -rf node_modules/.prisma/client .next/standalone/.prisma/ && \
    cp -rf prisma .next/standalone/prisma && \
    find .next/standalone -name "libquery_engine-*" -exec chmod +x {} \; || true && \
    ls -la .next/standalone/.prisma/client/

# Production stage
FROM node:22.11.0-slim AS production

WORKDIR /usr/src/app

# Copy built app from builder stage
COPY --from=builder /app/.next/standalone /usr/src/app
COPY --from=builder /app/.next/static /usr/src/app/.next/static
COPY --from=builder /app/public /usr/src/app/public
COPY --from=builder /app/node_modules/.prisma /usr/src/app/.prisma
COPY --from=builder /app/prisma /usr/src/app/prisma

# Install production dependencies
RUN apt-get update && apt-get install -y openssl ca-certificates && \
    chmod -R +x /usr/src/app/.prisma/client && \
    ls -la /usr/src/app/.prisma/client/

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    DEBUG=prisma:*

EXPOSE 3000

CMD ["node", "server.js"]
