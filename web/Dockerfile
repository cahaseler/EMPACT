# Builder stage
FROM node:22.11.0-slim AS builder

WORKDIR /app

# Copy root and web package files
COPY package.json yarn.lock ./
COPY web/package.json ./web/
# Add copies for any other workspaces if their package.json is needed for install logic
# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the source code
COPY . .

# Generate Prisma client
RUN yarn workspace web npx prisma generate --schema=prisma/mssql/schema.prisma

# Build Next.js app
RUN yarn workspace web build

# Set up standalone Next.js output
RUN cp -rf web/public web/.next/standalone/public && \
    cp -rf web/.next/static web/.next/standalone/.next/static && \
    mkdir -p web/.next/standalone/.prisma && \
    cp -rf node_modules/.prisma/client web/.next/standalone/.prisma/ && \
    cp -rf web/prisma web/.next/standalone/prisma && \
    find web/.next/standalone -name "libquery_engine-*" -exec chmod +x {} \; || true && \
    ls -la web/.next/standalone/.prisma/client/

# Production stage
FROM node:22.11.0-slim AS production

WORKDIR /usr/src/app

# Copy built app from builder stage
COPY --from=builder /app/web/.next/standalone /usr/src/app
COPY --from=builder /app/web/.next/static /usr/src/app/.next/static
COPY --from=builder /app/web/public /usr/src/app/public
COPY --from=builder /app/node_modules/.prisma /usr/src/app/.prisma
COPY --from=builder /app/web/prisma /usr/src/app/prisma

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
