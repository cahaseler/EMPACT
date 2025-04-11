# Builder stage: Install all dependencies, copy source, build the app
FROM node:22.11.0-bookworm AS builder
WORKDIR /app

# Copy package files first for better caching
COPY web/package.json web/yarn.lock ./

# Install ALL dependencies (including devDependencies needed for build)
RUN yarn install --frozen-lockfile

# Copy the rest of the source code
COPY web/. .

# Build the Next.js app (includes prisma generate)
RUN yarn build

# Production stage: Install only production dependencies, copy build artifacts
FROM node:22.11.0-bookworm AS production
WORKDIR /usr/src/app

# Copy package files
COPY web/package.json web/yarn.lock ./

# Install ONLY production dependencies
RUN yarn install --production --frozen-lockfile

# Copy necessary artifacts from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Copy Prisma client generated during build and schema files
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Install runtime dependencies (like OpenSSL for Prisma) and ensure Prisma engines are executable
RUN apt-get update && apt-get install -y openssl ca-certificates && \
    find ./node_modules/.prisma/client -name "libquery_engine-*" -exec chmod +x {} \; || true && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables for production
ENV NODE_ENV=production \
    PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Start the app using the standard Next.js start script
CMD ["yarn", "start"]
